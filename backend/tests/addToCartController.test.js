// tests/addToCartController.test.js

// Importăm modulele necesare
const addToCartController = require('../controller/user/addToCartController'); // Calea către controllerul tău
const addToCartModel = require('../models/cartProduct');

// Creăm un mock pentru addToCartModel
jest.mock('../models/cartProduct');

describe('addToCartController', () => {
    let req, res;

    beforeEach(() => {
        // Pregătim obiectele req și res
        req = {
            body: { productId: 'prod123' },
            userId: 'user123'
        };

        res = {
            json: jest.fn() // Mock pentru metoda res.json
        };
    });

    it('ar trebui să creeze un coș nou dacă utilizatorul nu are unul', async () => {
        // Mock pentru addToCartModel.findOne - nu găsește un coș
        addToCartModel.findOne.mockResolvedValue(null);
        
        // Mock pentru salvarea unui nou coș
        addToCartModel.prototype.save = jest.fn().mockResolvedValue({
            userId: 'user123',
            products: [{ productId: 'prod123', quantity: 1 }],
            totalQuantity: 1
        });

        await addToCartController(req, res);

        // Verificăm dacă a fost creat un coș nou
        expect(addToCartModel.prototype.save).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: "Produs adăugat în coș",
            data: expect.objectContaining({
                userId: 'user123',
                totalQuantity: 1
            }),
            success: true,
            error: false
        }));
    });

    it('ar trebui să mărească cantitatea produsului dacă acesta există deja în coș', async () => {
        // Mock pentru găsirea coșului existent
        addToCartModel.findOne.mockResolvedValue({
            userId: 'user123',
            products: [{ productId: 'prod123', quantity: 1 }],
            totalQuantity: 1,
            save: jest.fn().mockResolvedValue({
                userId: 'user123',
                products: [{ productId: 'prod123', quantity: 2 }],
                totalQuantity: 2
            })
        });

        await addToCartController(req, res);

        // Verificăm dacă cantitatea a fost mărită
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: "Produs adăugat în coș",
            data: expect.objectContaining({
                totalQuantity: 2,
                products: expect.arrayContaining([
                    expect.objectContaining({ quantity: 2 })
                ])
            }),
            success: true,
            error: false
        }));
    });

    it('ar trebui să adauge un produs nou dacă nu există în coș', async () => {
        // Mock pentru coșul existent fără produsul specificat
        addToCartModel.findOne.mockResolvedValue({
            userId: 'user123',
            products: [{ productId: 'prod456', quantity: 1 }], // Un produs diferit
            totalQuantity: 1,
            save: jest.fn().mockResolvedValue({
                userId: 'user123',
                products: [
                    { productId: 'prod456', quantity: 1 },
                    { productId: 'prod123', quantity: 1 } // Produsul nou adăugat
                ],
                totalQuantity: 2
            })
        });

        await addToCartController(req, res);

        // Verificăm dacă produsul a fost adăugat în coș
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: "Produs adăugat în coș",
            data: expect.objectContaining({
                totalQuantity: 2,
                products: expect.arrayContaining([
                    expect.objectContaining({ productId: 'prod123', quantity: 1 })
                ])
            }),
            success: true,
            error: false
        }));
    });
});
