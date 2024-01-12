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
	// 注册自定义注释和翻译命令
	let customCommentDisposable = vscode.commands.registerCommand('custom.action.jsCommentAndTranslate', async () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) return;

		for (const selection of editor.selections) {
			await handleCommenting(editor, selection);
		}
	});

	// 注册一个命令用于提示用户如何添加快捷键
	let showKeybindingInstructionDisposable = vscode.commands.registerCommand('custom.showKeybindingInstruction', () => {
		vscode.window.showInformationMessage(`若要为"Comment and Translate"功能添加快捷键，请在'keybindings.json'文件中加入以下内容：
			
			{
					"key": "ctrl+m",
					"command": "custom.action.jsCommentAndTranslate",
					"when": "editorTextFocus && editorLangId == javascript"
			}`);
	});

	// 添加命令到上下文菜单（可选）
	context.subscriptions.push(vscode.commands.registerCommand('editorContext.customCommentAndTranslate', () => {
		vscode.commands.executeCommand('custom.action.jsCommentAndTranslate');
	}));

	// 注册命令至命令面板以便用户执行
	context.subscriptions.push(customCommentDisposable);
	context.subscriptions.push(showKeybindingInstructionDisposable);

	// 提示用户运行 'custom.showKeybindingInstruction' 命令以了解如何添加快捷键
	vscode.window.showInformationMessage("欢迎使用 Comment and Translate 扩展！要添加快捷键，请运行 'Custom: Show Keybinding Instruction' 命令。");
}

// 假设你已经有了从百度翻译获取的appId和apiKey
const extensionConfig = vscode.workspace.getConfiguration('philologicalTranslation');
const appId = extensionConfig.get('appId');
const apiKey = extensionConfig.get('apiKey');

const TranslationServiceInstance = new TranslationService(appId, apiKey);

async function translateText (chineseText, form, to, editor, line) {
	try {
		const translatedText = await TranslationServiceInstance.translateComment(chineseText, form, to);
		// 替换选中的注释文本为翻译结果
		// 将翻译结果插入到注释内容之后（这里假设是同一行）
		const translationInsertionPosition = new vscode.Position(line, Number.MAX_VALUE);
		const translationWithNewLine = `  天才翻译：${translatedText}`;
		console.log(translationWithNewLine, 12345)
		await editor.edit(editBuilder => {
			editBuilder.insert(translationInsertionPosition, translationWithNewLine);
		});
		vscode.window.showInformationMessage(`翻译结果: ${translatedText}`);
		console.log('Translated text:', translatedText);
	} catch (error) {
		console.error('Error during translation:', error.message);
	}
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
async function customCommentForJS (editor, selection) {
	// 对每个选区进行单独的注释操作
	// 对每个选区内的每一行分别执行注释操作
	for (let line = selection.start.line; line < selection.end.line + 1; line++) {
		// 获取当前行文本
		const currentLineText = editor.document.lineAt(line).text.trim();
		// 获取注释后的单行文本并翻译
		let commentedLineText = editor.document.lineAt(line).text.trim().substring(3); // 去掉'// '

		// 判断是否包含注释，如果包含就取消注释   并且不翻译
		if (currentLineText.includes('//')) {
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

		await translateText(commentedLineText, isFrom, isTo, editor, line)
		// 在这里执行你的自定义逻辑，例如：
		// vscode.window.showInformationMessage('You just commented/uncommented a line!');
	}

}
// 处理注释时触发的动作
async function handleCommenting (editor, selection) {
	// 对选区进行注释操作（可以调用VSCode内置API或自定义逻辑）
	await customCommentForJS(editor, selection);
}

// 插件停用时清理资源
function deactivate () { }

module.exports = {
	activate,
	deactivate
}
