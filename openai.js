// OpenAI API 클라이언트 (최신 버전)
class OpenAI {
    constructor(config) {
        this.apiKey = config.apiKey;
        this.baseURL = 'https://api.openai.com/v1';
        this.defaultHeaders = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
            'User-Agent': 'YourNameCalligraphy/1.0'
        };
    }

    async createChatCompletion(params) {
        try {
            const response = await fetch(`${this.baseURL}/chat/completions`, {
                method: 'POST',
                headers: this.defaultHeaders,
                body: JSON.stringify({
                    ...params,
                    stream: false // 스트리밍 비활성화
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMessage = errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`;
                throw new Error(`OpenAI API Error: ${errorMessage}`);
            }

            const data = await response.json();
            console.log('OpenAI API Response:', data);
            return data;
        } catch (error) {
            console.error('OpenAI API Error:', error);
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error('네트워크 연결을 확인해주세요.');
            }
            throw error;
        }
    }

    async generateImage(params) {
        try {
            const response = await fetch(`${this.baseURL}/images/generations`, {
                method: 'POST',
                headers: this.defaultHeaders,
                body: JSON.stringify(params)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMessage = errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`;
                throw new Error(`OpenAI Image API Error: ${errorMessage}`);
            }

            const data = await response.json();
            return {
                data: data.data.map(item => ({
                    url: item.url
                }))
            };
        } catch (error) {
            console.error('OpenAI Image API Error:', error);
            throw error;
        }
    }

    // API 키 유효성 검사
    async validateApiKey() {
        try {
            const response = await this.createChatCompletion({
                model: "gpt-4o",
                messages: [{ role: "user", content: "Hello" }],
                max_tokens: 5
            });
            return true;
        } catch (error) {
            console.error('API Key validation failed:', error);
            return false;
        }
    }
}

// 전역 객체에 OpenAI 추가
window.OpenAI = OpenAI; 