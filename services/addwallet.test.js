//import
const { getBalance } = require("./balance");
const Wallet = require("../models/wallet");

//mock database
jest.mock("../models/wallet");

//test
describe("addwalletService by use .getBalance from balance", () => {
    it("phone number format is invalid", async () => {
        Wallet.findOne.mockResolvedValue("123456789A"); // mock ให้ findOne คืนค่า 

        //ผลที่คาดหวัง
        await expect(getBalance("123456789A"))
            .rejects.toThrow("Invalid phone number format.");
    });

    it("phone number not found", async () => {
        Wallet.findOne.mockResolvedValue(null); // mock ให้ findOne คืนค่า null

        //ผลที่คาดหวัง
        await expect(getBalance("1234567890"))
            .rejects.toThrow("Phone number not found.");
    });

    it("phone number is found", async () => {
        const mockWallet = { phoneNumber: "1234567890", totalBalance: 1000 }; // ค่ากระเป๋าเงิน
        Wallet.findOne.mockResolvedValue(mockWallet); // mock ให้ findOne คืนค่ากระเป๋าเงิน

        const balance = await getBalance("1234567890");

        //ผลที่คาดหวัง
        expect(balance).toBe(1000);
    });
});
