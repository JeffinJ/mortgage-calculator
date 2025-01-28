import { InterestRateData } from "@/types/mortgage";

export class InterestRateService {
    private static readonly FALLBACK_RATE = 5.28;

    static async fetchCurrentRate(apiUrl: string): Promise<InterestRateData> {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error(`Failed to fetch bank rate: ${response.statusText}`);

            const data = await this.parseRateResponse(response);
            return this.validateRateData(data);
        } catch (error) {
            console.error('Error fetching interest rate:', error);
            return {
                date: new Date().toISOString(),
                rate: this.FALLBACK_RATE
            };
        }
    }

    private static async parseRateResponse(response: Response): Promise<InterestRateData> {
        const text = await response.text();
        const lines = text.split('\n').filter(line => line.trim());
        const lastLine = lines[lines.length - 1];

        if (!lastLine) throw new Error('No data found in response');

        const [dateStr, rateStr] = lastLine.split(',').map(str => str.trim());
        return {
            date: dateStr,
            rate: parseFloat(rateStr)
        };
    }

    private static validateRateData(data: InterestRateData): InterestRateData {
        const date = new Date(data.date);

        if (isNaN(date.getTime())) throw new Error(`Invalid date format: ${data.date}`);
        if (isNaN(data.rate) || data.rate < 0 || data.rate > 100) throw new Error(`Invalid rate: ${data.rate}`);

        return {
            date: date.toISOString(),
            rate: data.rate
        };
    }
}