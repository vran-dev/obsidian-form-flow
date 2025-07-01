import { App, MarkdownView } from "obsidian";
import { localInstance } from "src/i18n/locals";
import { focusLatestEditor } from "src/utils/focusLatestEditor";

export default class {

    async insertToCurrentCursor(app: App, content: string) {
        focusLatestEditor(app);
        const editor = app.workspace.getActiveViewOfType(MarkdownView)?.editor;

        if (editor) {
            const cursor = editor.getCursor("from");
            const end = editor.getCursor("to");
            const origin = editor.getSelection();
            editor.replaceRange(content, cursor, end, origin);
            // update cursor to the end of the inserted content
            const newCursor = {
                line: cursor.line,
                ch: cursor.ch + content.length
            };
            editor.setCursor(newCursor);
        } else {
            throw new Error(localInstance.please_open_and_focus_on_markdown_file);
        }
    }

    /**
      * 将内容写入到笔记底部
      * @param app Obsidian App 实例
      * @param filePath 文件路径
      * @param content 要插入的内容
      */
    async insertToBottomOfNote(app: App, filePath: string, content: string): Promise<void> {
        try {
            const rawContent = await app.vault.adapter.read(filePath);
            // 确保在内容之间有一个换行符
            const newContent = rawContent.endsWith('\n')
                ? rawContent + content
                : rawContent + '\n' + content;

            await app.vault.adapter.write(filePath, newContent);
        } catch (error) {
            new Error(localInstance.submit_failed + ":" + error);
        }
    }

    /**
     * 将内容写入到笔记顶部
     * @param app Obsidian App 实例
     * @param filePath 文件路径
     * @param content 要插入的内容
     */
    async insertToTopOfNote(app: App, filePath: string, content: string): Promise<void> {
        try {
            const metaCache = app.metadataCache.getCache(filePath);
            if (!metaCache) {
                throw new Error(localInstance.please_retry_later);
            }
            const frontmatterPosition = metaCache.frontmatterPosition;
            const rawContent = await app.vault.adapter.read(filePath);
            const rawContentLines = rawContent.split('\n');
            if (frontmatterPosition) {
                const endLine = frontmatterPosition.end.line;
                const frontmatterContent = rawContentLines.slice(0, endLine + 1).join('\n');
                const restContent = rawContentLines.slice(endLine + 1).join('\n');
                const newContent = frontmatterContent + '\n' + content + (restContent.startsWith('\n') ? '' : '\n') + restContent;
                await app.vault.adapter.write(filePath, newContent);
            } else {
                const newContent = content + (rawContent.startsWith('\n') ? '' : '\n') + rawContent;
                await app.vault.adapter.write(filePath, newContent);
            }
        } catch (error) {
            new Error(localInstance.submit_failed + ":" + error);
        }
    }

    /**
     * 在指定标题下方的顶部插入内容
     * @param app Obsidian App 实例
     * @param filePath 文件路径
     * @param heading 标题文本（含 # 符号）
     * @param content 要插入的内容
     */
    async insertToTopBelowTitle(app: App, filePath: string, heading: string, content: string): Promise<void> {
        const rawContent = await app.vault.adapter.read(filePath);
        const task = `${content}`;
        const rawContentLines = rawContent.split('\n');
        let added = false;
        const newContentLines = rawContentLines.flatMap((line, index) => {
            if (added) {
                return [line];
            }
            if (line === heading) {
                added = true;
                return [line, task];
            }
            return [line];
        })

        let newContent;
        if (added) {
            newContent = newContentLines.join('\n');
        } else {
            newContent = rawContent + '\n' + heading + '\n' + task;
        }
        await app.vault.adapter.write(filePath, newContent);
    }

    /**
     * 在指定标题区域的底部插入内容
     * @param app Obsidian App 实例
     * @param filePath 文件路径
     * @param heading 标题文本（含 # 符号）
     * @param content 要插入的内容
     */
    async insertToBottomBelowTitle(app: App, filePath: string, heading: string, content: string): Promise<void> {
        const rawContent = await app.vault.adapter.read(filePath);
        const insertingText = `${content}`;
        const rawContentLines = rawContent.split('\n');
        let headingFound = false;
        let added = false;
        const newContentLines = rawContentLines.flatMap((line, index) => {
            if (added) {
                return [line];
            }
            if (line === heading && !headingFound) {
                headingFound = true;
                return [line];
            }

            if (headingFound) {
                const isHeadingLine = line.match(/^#+ /);
                if (isHeadingLine) {
                    added = true;
                    return [insertingText, line];
                }
            }
            return [line];
        })

        let newContent;
        if (added) {
            newContent = newContentLines.join('\n');
        } else {
            if (headingFound) {
                const isEndsWithNewLine = rawContent.endsWith('\n');
                newContent = isEndsWithNewLine ? rawContent + insertingText : rawContent + '\n' + insertingText;
            } else {
                newContent = rawContent + '\n' + heading + '\n' + insertingText;
            }
        }
        await app.vault.adapter.write(filePath, newContent);
    }
}