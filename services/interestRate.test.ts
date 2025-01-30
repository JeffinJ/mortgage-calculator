import { InterestRateService } from "./interestRate";

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('InterestRateService', () => {
    const TEST_API_URL = 'https://www.bankofengland.co.uk/boeapps/iadb/fromshowcolumns.asp?csv.x=yes&Datefrom=18/Jan/2024&Dateto=18/Feb/2024&SeriesCodes=IUMABEDR&CSVF=TN&UsingCodes=Y&VPD=Y&VFD=N';

    beforeEach(() => {
        // Clear mock before each test
        mockFetch.mockClear();
    });

    describe('fetchCurrentRate', () => {
        test('should successfully fetch and parse rate data', async () => {
            const mockDate = '2025-01-30';
            const mockRate = 4.5;
            const mockResponse = `Date,Rate\n${mockDate},${mockRate}`;

            mockFetch.mockResolvedValueOnce({
                ok: true,
                text: () => Promise.resolve(mockResponse)
            });

            const result = await InterestRateService.fetchCurrentRate(TEST_API_URL);

            expect(mockFetch).toHaveBeenCalledWith(TEST_API_URL);
            expect(result).toEqual({
                date: new Date(mockDate).toISOString(),
                rate: mockRate
            });
        });

        test('should return fallback rate when fetch fails', async () => {
            mockFetch.mockRejectedValueOnce(new Error('Network error'));

            const result = await InterestRateService.fetchCurrentRate(TEST_API_URL);

            expect(result.rate).toBe(5.28); // Fallback rate
            expect(new Date(result.date)).toBeInstanceOf(Date);
        });

        test('should return fallback rate when response is not ok', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: false,
                statusText: 'Not Found'
            });

            const result = await InterestRateService.fetchCurrentRate(TEST_API_URL);

            expect(result.rate).toBe(5.28);
            expect(new Date(result.date)).toBeInstanceOf(Date);
        });

        test('should handle multiple lines of data and use the latest', async () => {
            const mockResponse = `Date,Rate
2025-01-29,4.2
2025-01-30,4.5`;

            mockFetch.mockResolvedValueOnce({
                ok: true,
                text: () => Promise.resolve(mockResponse)
            });

            const result = await InterestRateService.fetchCurrentRate(TEST_API_URL);

            expect(result).toEqual({
                date: new Date('2025-01-30').toISOString(),
                rate: 4.5
            });
        });
    });

    describe('parseRateResponse', () => {
        test('should throw error when response is empty', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                text: () => Promise.resolve('')
            });

            await expect(InterestRateService.fetchCurrentRate(TEST_API_URL))
                .resolves
                .toEqual({
                    date: expect.any(String),
                    rate: 5.28
                });
        });

        test('should handle whitespace in response', async () => {
            const mockResponse = `Date,Rate
        2025-01-30  ,  4.5  `;

            mockFetch.mockResolvedValueOnce({
                ok: true,
                text: () => Promise.resolve(mockResponse)
            });

            const result = await InterestRateService.fetchCurrentRate(TEST_API_URL);

            expect(result).toEqual({
                date: new Date('2025-01-30').toISOString(),
                rate: 4.5
            });
        });
    });

    describe('validateRateData', () => {
        test('should throw error for invalid date format', async () => {
            const mockResponse = 'Date,Rate\ninvalid-date,4.5';

            mockFetch.mockResolvedValueOnce({
                ok: true,
                text: () => Promise.resolve(mockResponse)
            });

            const result = await InterestRateService.fetchCurrentRate(TEST_API_URL);

            // Should fall back to current date and fallback rate
            expect(result.rate).toBe(5.28);
            expect(new Date(result.date)).toBeInstanceOf(Date);
        });

        test('should throw error for invalid rate value', async () => {
            const mockResponse = 'Date,Rate\n2025-01-30,invalid';

            mockFetch.mockResolvedValueOnce({
                ok: true,
                text: () => Promise.resolve(mockResponse)
            });

            const result = await InterestRateService.fetchCurrentRate(TEST_API_URL);

            expect(result.rate).toBe(5.28);
        });

        test('should throw error for out of range rate', async () => {
            const mockResponse = 'Date,Rate\n2025-01-30,101';

            mockFetch.mockResolvedValueOnce({
                ok: true,
                text: () => Promise.resolve(mockResponse)
            });

            const result = await InterestRateService.fetchCurrentRate(TEST_API_URL);

            expect(result.rate).toBe(5.28);
        });

        test('should throw error for negative rate', async () => {
            const mockResponse = 'Date,Rate\n2025-01-30,-1';

            mockFetch.mockResolvedValueOnce({
                ok: true,
                text: () => Promise.resolve(mockResponse)
            });

            const result = await InterestRateService.fetchCurrentRate(TEST_API_URL);

            expect(result.rate).toBe(5.28);
        });
    });
});