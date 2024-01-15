// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const TranslationService = require('./translate-service')

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
// 激活插件时注册事件处理器
function activate (context) {
	// 注册自定义注释和翻译命令 ctrl+m
	let customCommentDisposable = vscode.commands.registerCommand('custom.action.jsCommentAndTranslate', async () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) return;

		for (const selection of editor.selections) {
			await handleCommenting(editor, selection);
		}
	});

	// 注册自定义注释和翻译命令驼峰式 ctrl+alt+m
	let customCommentDisposableHump = vscode.commands.registerCommand('custom.action.jsCommentAndTranslateHump', async () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) return;

		for (const selection of editor.selections) {
			await handleCommenting(editor, selection, true);
		}
	});

	// 添加命令到上下文菜单（可选）
	context.subscriptions.push(vscode.commands.registerCommand('editorContext.customCommentAndTranslate', () => {
		vscode.commands.executeCommand('custom.action.jsCommentAndTranslate');
		vscode.commands.executeCommand('custom.action.jsCommentAndTranslateHump');
	}));


	// 注册命令至命令面板以便用户执行
	context.subscriptions.push(customCommentDisposable);
	context.subscriptions.push(customCommentDisposableHump);

	// 提示用户运行 'custom.showKeybindingInstruction' 命令以了解如何添加快捷键
	vscode.window.showInformationMessage("欢迎使用 天才翻译 扩展！请在 setting 中自行添加 百度翻译（appId、apiKey）后，即可执行'Custom: Show Keybinding Instruction' 命令 || Ctrl+M 进行翻译啦！");
}

// 假设你已经有了从百度翻译获取的appId和apiKey
const extensionConfig = vscode.workspace.getConfiguration('philologicalTranslation');
const appId = extensionConfig.get('appId');
const apiKey = extensionConfig.get('apiKey');

const TranslationServiceInstance = new TranslationService(appId, apiKey);

async function translateText (chineseText, form, to, editor, line, hump) {
	try {
		let translatedText = await TranslationServiceInstance.translateComment(chineseText, form, to);
		// 如果是转驼峰方法的话就执行一下 转驼峰函数
		if (hump && form === 'zh') {
			translatedText = translateAndConvertToCamelCase(translatedText)
		}
		// 替换选中的注释文本为翻译结果
		// 将翻译结果插入到注释内容之后（这里假设是同一行）
		const translationInsertionPosition = new vscode.Position(line, Number.MAX_VALUE);
		const translationWithNewLine = `  天才翻译 : ${translatedText}`;
		await editor.edit(editBuilder => {
			editBuilder.insert(translationInsertionPosition, translationWithNewLine);
		});
		vscode.window.showInformationMessage(`翻译结果: ${translatedText}`);
		console.log('Translated text:', translatedText);
	} catch (error) {
		console.error('Error during translation:', error.message);
	}
}

function translateAndConvertToCamelCase (text) {
	// 首先移除所有空格并将字符串分割成单词数组
	const words = text.replace(/\s+/g, ' ').trim().split(' ');

	// 将单词数组转换为驼峰格式（小驼峰）
	const camelCaseText = words.reduce((acc, word, index) => {
		return acc + (index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
	}, '');

	return camelCaseText;
}

function detectLanguageInComment (comment) {
	const hasEnglish = /[a-zA-Z]/.test(comment);
	const hasChinese = /[\u4e00-\u9fa5]/.test(comment);
	if (hasEnglish && !hasChinese) {
		return 'en';
	} else if (!hasEnglish && hasChinese) {
		return 'zh';
	} else if (hasEnglish && hasChinese) {
		return 'zh';
	} else {
		return '';
	}
}
async function customCommentForJS (editor, selection, hump) {
	// 对每个选区进行单独的注释操作
	// 对每个选区内的每一行分别执行注释操作
	for (let line = selection.start.line; line < selection.end.line + 1; line++) {
		// 获取当前行文本
		const currentLineText = editor.document.lineAt(line).text.trim();
		// 获取注释后的单行文本并翻译
		let commentedLineText = editor.document.lineAt(line).text.trim().substring(3); // 去掉'// '

		// 判断是否包含注释，如果包含就取消注释   并且不翻译
		if (currentLineText.includes('//') && currentLineText.indexOf('//') === 0) {
			const rangeToUpdate = new vscode.Range(new vscode.Position(line, 0), new vscode.Position(line, Number.MAX_VALUE));
			await editor.edit(editBuilder => {
				editBuilder.replace(rangeToUpdate, commentedLineText);
			});
			continue
		}
		// 添加
		const commentRange = new vscode.Range(new vscode.Position(line, 0), new vscode.Position(line, Number.MAX_VALUE));
		// 添加 // 注释
		await editor.edit(editBuilder => {
			editBuilder.insert(commentRange.start, '// ');
		});
		// 取最新
		commentedLineText = editor.document.lineAt(line).text.trim().substring(3); // 去掉'// '
		// 是否为中英文
		const isFrom = detectLanguageInComment(commentedLineText)
		if (!isFrom) continue
		const isTo = isFrom === 'zh' ? 'en' : 'zh'

		// 判断当前行文本是否包含“天才翻译” 包含就跳过 否则就需要翻译了
		if (currentLineText.includes('天才翻译')) {
			continue
		}

		await translateText(commentedLineText, isFrom, isTo, editor, line, hump)
		// 在这里执行你的自定义逻辑，例如：
		// vscode.window.showInformationMessage('You just commented/uncommented a line!');
	}

}
// 处理注释时触发的动作
async function handleCommenting (editor, selection, hump = false) {
	// 对选区进行注释操作（可以调用VSCode内置API或自定义逻辑）
	await customCommentForJS(editor, selection, hump);
}

// 插件停用时清理资源
function deactivate () { }

module.exports = {
	activate,
	deactivate
}
