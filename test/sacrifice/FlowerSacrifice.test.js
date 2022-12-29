const FlowerSacrifice = artifacts.require('FlowerSacrifice.sol');
const truffleAssert = require('truffle-assertions');
const MockERC721 = artifacts.require('MockERC721.sol');

contract('FlowerSacrifice', function(accounts) {
    describe('all', function() {
        let sacrifice;
        let web3Sacrifice;
        let mockErc721;
        let secondMockErc721;

        beforeEach(async function() {
            mockErc721 = await MockERC721.new();
            secondMockErc721 = await MockERC721.new();
            sacrifice = await FlowerSacrifice.new(mockErc721.address);
            web3Sacrifice = new web3.eth.Contract(
                FlowerSacrifice.abi,
                sacrifice.address
            );
        });

        async function burn(transactionSender, id1, id2, id3) {
            await sacrifice.burn(id1, id2, id3, { from: transactionSender });
        }

        it('MockErcERC721 Mock mint', async function() {
            await mockErc721.mintForMe(123, { from: accounts[0] });
        });

        it('MockErc721: approval and allowance', async function() {
            await mockErc721.mintForMe(1, { from: accounts[0] });
            await mockErc721.mintForMe(2, { from: accounts[0] });
            await mockErc721.mintForMe(3, { from: accounts[0] });

            await mockErc721.setApprovalForAll(sacrifice.address, true, {
                from: accounts[0],
            });

            const isApprovedForAll = await mockErc721.methods[
                'isApprovedForAll(address,address)'
            ](accounts[0], sacrifice.address);

            assert(isApprovedForAll, 'is not approved for all');
        });

        it('FlowerSacrifice: Burning NFTs that are not yours', async function() {
            await mockErc721.mintForMe(1, { from: accounts[0] });
            await mockErc721.mintForMe(2, { from: accounts[0] });
            await mockErc721.mintForMe(3, { from: accounts[1] });

            await mockErc721.setApprovalForAll(sacrifice.address, true, {
                from: accounts[0],
            });

            await truffleAssert.reverts(
                burn(accounts[0], 1, 2, 3),
                'FlowerSacrifice: You must own this FLOWER in order to sacrifice it.'
            );
        });

        it('FlowerSacrifice: Burning NFTs that are not yours', async function() {
            await mockErc721.mintForMe(1, { from: accounts[0] });
            await mockErc721.mintForMe(2, { from: accounts[0] });
            await mockErc721.mintForMe(3, { from: accounts[0] });

            await mockErc721.setApprovalForAll(sacrifice.address, true, {
                from: accounts[0],
            });

            await truffleAssert.reverts(
                burn(accounts[1], 1, 2, 3),
                'FlowerSacrifice: You must own this FLOWER in order to sacrifice it.'
            );
        });

        it('FlowerSacrifice: Lack of approval', async function() {
            await mockErc721.mintForMe(1, { from: accounts[0] });
            await mockErc721.mintForMe(2, { from: accounts[0] });
            await mockErc721.mintForMe(3, { from: accounts[0] });

            await truffleAssert.reverts(
                burn(accounts[0], 1, 2, 3),
                'You must approve FLOWERs before sacrificing them.'
            );
        });

        it('FlowerSacrifice: Partial approval', async function() {
            await mockErc721.mintForMe(1, { from: accounts[0] });
            await mockErc721.mintForMe(2, { from: accounts[0] });
            await mockErc721.mintForMe(3, { from: accounts[0] });

            await mockErc721.approve(sacrifice.address, 1, {
                from: accounts[0],
            });
            await mockErc721.approve(sacrifice.address, 2, {
                from: accounts[0],
            });

            await truffleAssert.reverts(
                burn(accounts[0], 1, 2, 3),
                'You must approve FLOWERs before sacrificing them.'
            );
        });

        // I'm not going to support manual approval for now, only setApprovalForAll().

        // it('FlowerSacrifice: Manual full approval', async function() {
        //     await mockErc721.mintForMe(1, { from: accounts[0] });
        //     await mockErc721.mintForMe(2, { from: accounts[0] });
        //     await mockErc721.mintForMe(3, { from: accounts[0] });

        //     await mockErc721.approve(sacrifice.address, 1, {
        //         from: accounts[0],
        //     });
        //     await mockErc721.approve(sacrifice.address, 2, {
        //         from: accounts[0],
        //     });
        //     await mockErc721.approve(sacrifice.address, 3, {
        //         from: accounts[0],
        //     });

        //     await burn(accounts[0], 1, 2, 3);
        // });

        it('FlowerSacrifice: basic', async function() {
            await mockErc721.mintForMe(1, { from: accounts[0] });
            await mockErc721.mintForMe(2, { from: accounts[0] });
            await mockErc721.mintForMe(3, { from: accounts[0] });

            await mockErc721.setApprovalForAll(sacrifice.address, true, {
                from: accounts[0],
            });

            await burn(accounts[0], 1, 2, 3);

            const newOwner1 = await mockErc721.ownerOf(1);
            assert(
                newOwner1 === '0x000000000000000000000000000000000000dEaD',
                'NFTs were not sent to burn address'
            );
            const newOwner2 = await mockErc721.ownerOf(2);
            assert(
                newOwner2 === '0x000000000000000000000000000000000000dEaD',
                'NFTs were not sent to burn address'
            );
            const newOwner3 = await mockErc721.ownerOf(3);
            assert(
                newOwner3 === '0x000000000000000000000000000000000000dEaD',
                'NFTs were not sent to burn address'
            );
        });

        it('FlowerSacrifice: make sure other nfts dont get burned', async function() {
            await mockErc721.mintForMe(1, { from: accounts[0] });
            await mockErc721.mintForMe(2, { from: accounts[0] });
            await mockErc721.mintForMe(3, { from: accounts[0] });

            await secondMockErc721.mintForMe(1, { from: accounts[0] });
            await secondMockErc721.mintForMe(2, { from: accounts[0] });
            await secondMockErc721.mintForMe(3, { from: accounts[0] });

            await mockErc721.setApprovalForAll(sacrifice.address, true, {
                from: accounts[0],
            });

            const newOwner1 = await secondMockErc721.ownerOf(1);
            assert(
                newOwner1 === accounts[0],
                'NFTs from another contract were burned!'
            );
            const newOwner2 = await secondMockErc721.ownerOf(2);
            assert(
                newOwner2 === accounts[0],
                'NFTs were not sent to burn address'
            );
            const newOwner3 = await secondMockErc721.ownerOf(3);
            assert(
                newOwner3 === accounts[0],
                'NFTs were not sent to burn address'
            );
        });
    });
});
