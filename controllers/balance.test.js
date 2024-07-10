// import
const { balance } = require("./balance");
const balanceService = require("../services/balance");

// mock services
jest.mock("../services/balance");

// test
describe("check traffic", () => {
    let req, res, next;

    beforeEach(() => {
        req = { query: { phoneNumber: "" } };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    it("should return 400 if phone number format is invalid", async () => {
        req.query.phoneNumber = "invalidPhoneNumber";
        balanceService.getBalance.mockImplementation(() => {
            throw new Error("Invalid phone number format.");
        });

        await balance(req, res, next);

        //ผลที่คาดหวัง
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Invalid phone number format." });
    });

    it("should return 404 if phone number is not found", async () => {
        req.query.phoneNumber = "1234567890";
        balanceService.getBalance.mockImplementation(() => {
            throw new Error("Phone number not found.");
        });

        await balance(req, res, next);

        //ผลที่คาดหวัง
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "Phone number not found." });
    });

    it("should return 200 when phone number is found", async () => {
        req.query.phoneNumber = "1234567890";
        const mockBalance = 1000;
        balanceService.getBalance.mockResolvedValue(mockBalance);

        await balance(req, res, next);

        //ผลที่คาดหวัง
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: "Phone number exists.",
            phoneNumber: "1234567890",
            totalBalance: mockBalance
        });
    });

    it("should return 500 server error", async () => {
        req.query.phoneNumber = "1234567890";
        balanceService.getBalance.mockImplementation(() => { throw new Error("Server error"); });

        await balance(req, res, next);

        //ผลที่คาดหวัง
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: "Server Error",
            statusCode: 500
        }));
    });
});
