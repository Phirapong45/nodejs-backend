//import
const { admin } = require("../controllers/admin");
const adminService = require("../services/admin");

//mock services
jest.mock("../services/admin");

//test
describe("check traffic", () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            body: {
                phoneNumber: '1234567890',
                topupAmount: '500'
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        next = jest.fn();
    });

    it('should return 200 and phone number exists', async () => {
        adminService.adminTopup.mockResolvedValue({ totalBalance: 1500 });

        await admin(req, res, next);

        //ผลที่คาดหวัง
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: "Phone number exists.",
            phoneNumber: req.body.phoneNumber,
            totalBalance: 1500
        });
    });

    it('should return 400 if 1000<value<100', async () => {
        adminService.adminTopup.mockRejectedValue(new Error('Value must be between 100 and 1000.'));

        await admin(req, res, next);

        //ผลที่คาดหวัง
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Value must be between 100 and 1000.' });
    });

    it('should return 404 if phone number not found', async () => {
        adminService.adminTopup.mockRejectedValue(new Error('Phone number not found.'));

        await admin(req, res, next);
        //ผลที่คาดหวัง
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Phone number not found.' });
    });

    it('should return 500 server error', async () => {
        adminService.adminTopup.mockRejectedValue(new Error('server error'));

        await admin(req, res, next);

        //ผลที่คาดหวัง
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Server Error',
            statusCode: 500
        }));
    });
});
