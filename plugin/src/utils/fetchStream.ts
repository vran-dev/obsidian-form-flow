type FetchStreamOptions = {
    method: string;
    headers: Record<string, string>;
    body?: string;
}

type ChunkProcessor = (chunk: string) => void;

/**
 * 通用的流式请求函数，仅处理原始数据流
 * @param url 请求URL
 * @param fetchOptions 请求选项
 * @param onChunk 每个数据块处理回调函数
 * @returns 完成时返回的Promise
 */
async function fetchStream(
    url: string | URL,
    fetchOptions: FetchStreamOptions,
    onChunk: ChunkProcessor
): Promise<void> {
    const response = await fetch(url, {
        ...fetchOptions
    });

    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
        throw new Error("Response body is not readable");
    }

    const decoder = new TextDecoder("utf-8");

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        onChunk(chunk);
    }
}

// JSON流式处理相关类型
type ParsedDataProcessor<T> = (parsedData: T) => void;

type JsonStreamOptions<T = any> = {
    onChunk?: ChunkProcessor;  // 可选的原始数据回调
    onParsedData: ParsedDataProcessor<T>;  // 必需的JSON数据回调
    dataLinePrefix?: string;   // 用于SSE格式的行前缀
    dataFinishMarker?: string; // 流结束标记
}

/**
 * 专门用于处理JSON流式数据的请求函数
 * @param url 请求URL
 * @param fetchOptions 请求选项
 * @param jsonOptions JSON流处理选项
 * @returns 完成时返回的Promise
 */
async function fetchJsonStream<T = any>(
    url: string | URL,
    fetchOptions: FetchStreamOptions,
    jsonOptions: JsonStreamOptions<T>
): Promise<void> {
    const {
        onChunk,
        onParsedData,
        dataLinePrefix = "data: ",
        dataFinishMarker = "[DONE]"
    } = jsonOptions;

    await fetchStream(url, fetchOptions, (chunk) => {
        // 如果提供了原始块处理器，调用它
        if (onChunk) {
            onChunk(chunk);
        }

        // 处理SSE格式数据
        const lines = chunk.split("\n").filter(line => line.trim() !== "");
        for (const line of lines) {
            if (line.startsWith(dataLinePrefix)) {
                const jsonString = line.slice(dataLinePrefix.length);

                // 处理特殊的 [DONE] 消息
                if (jsonString === dataFinishMarker) continue;

                try {
                    const parsedData = JSON.parse(jsonString) as T;
                    onParsedData(parsedData);
                } catch (e) {
                    console.error("Error parsing JSON:", e);
                }
            }
        }
    });
}

// 便利类型导出
export {
    fetchStream,
    fetchJsonStream,
    type FetchStreamOptions,
    type ChunkProcessor,
    type JsonStreamOptions,
    type ParsedDataProcessor
};