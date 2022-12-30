const FlowerSacrifice = artifacts.require('FlowerSacrifice.sol');
const truffleAssert = require('truffle-assertions');
const MockERC721Burnable = artifacts.require('MockERC721Burnable.sol');

contract('FlowerSacrifice', function(accounts) {
    describe('all', function() {
        let sacrifice;
        let web3Sacrifice;
        let mockErc721;
        let secondMockErc721;

        beforeEach(async function() {
            mockErc721 = await MockERC721Burnable.new();
            secondMockErc721 = await MockERC721Burnable.new();
            sacrifice = await FlowerSacrifice.new(mockErc721.address);
            web3Sacrifice = new web3.eth.Contract(
                FlowerSacrifice.abi,
                sacrifice.address
            );
        });

        async function burnOne(transactionSender, id1) {
            return await sacrifice.burnOne(
                web3.utils.asciiToHex('sacrificial-altar'),
                id1,
                {
                    from: transactionSender,
                }
            );
        }

        async function burnTwo(transactionSender, id1, id2) {
            return await sacrifice.burnTwo(
                web3.utils.asciiToHex('sacrificial-altar'),
                id1,
                id2,
                {
                    from: transactionSender,
                }
            );
        }

        async function burnThree(transactionSender, id1, id2, id3) {
            return await sacrifice.burnThree(
                web3.utils.asciiToHex('sacrificial-altar'),
                id1,
                id2,
                id3,
                {
                    from: transactionSender,
                }
            );
        }

        async function burnFour(transactionSender, id1, id2, id3, id4) {
            return await sacrifice.burnFour(
                web3.utils.asciiToHex('sacrificial-altar'),
                id1,
                id2,
                id3,
                id4,
                {
                    from: transactionSender,
                }
            );
        }

        async function burnFive(transactionSender, id1, id2, id3, id4, id5) {
            return await sacrifice.burnFive(
                web3.utils.asciiToHex('sacrificial-altar'),
                id1,
                id2,
                id3,
                id4,
                id5,
                {
                    from: transactionSender,
                }
            );
        }

        it('MockErcERC721 Mock mint', async function() {
            const r = await mockErc721.mintForMe(123, { from: accounts[0] });
            const owner = await mockErc721.ownerOf(123);
            assert(owner === accounts[0], 'Owner is not equal to mintee');
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

        it('BurnOne: Burning NFTs that are not yours', async function() {
            await mockErc721.mintForMe(1, { from: accounts[1] });

            await mockErc721.setApprovalForAll(sacrifice.address, true, {
                from: accounts[0],
            });

            await truffleAssert.reverts(
                burnOne(accounts[0], 1),
                'FlowerSacrifice: You must own this FLOWER in order to sacrifice it.'
            );
        });

        it('BurnTwo: Burning NFTs that are not yours', async function() {
            await mockErc721.mintForMe(1, { from: accounts[0] });
            await mockErc721.mintForMe(2, { from: accounts[1] });

            await mockErc721.setApprovalForAll(sacrifice.address, true, {
                from: accounts[0],
            });

            await truffleAssert.reverts(
                burnTwo(accounts[0], 1, 2),
                'FlowerSacrifice: You must own this FLOWER in order to sacrifice it.'
            );
        });

        it('BurnThree: Burning NFTs that are not yours', async function() {
            await mockErc721.mintForMe(1, { from: accounts[0] });
            await mockErc721.mintForMe(2, { from: accounts[0] });
            await mockErc721.mintForMe(3, { from: accounts[1] });

            await mockErc721.setApprovalForAll(sacrifice.address, true, {
                from: accounts[0],
            });

            await truffleAssert.reverts(
                burnThree(accounts[0], 1, 2, 3),
                'FlowerSacrifice: You must own this FLOWER in order to sacrifice it.'
            );
        });

        it('BurnFour: Burning NFTs that are not yours', async function() {
            await mockErc721.mintForMe(1, { from: accounts[0] });
            await mockErc721.mintForMe(2, { from: accounts[0] });
            await mockErc721.mintForMe(3, { from: accounts[0] });
            await mockErc721.mintForMe(4, { from: accounts[1] });

            await mockErc721.setApprovalForAll(sacrifice.address, true, {
                from: accounts[0],
            });

            await truffleAssert.reverts(
                burnFour(accounts[0], 1, 2, 3, 4),
                'FlowerSacrifice: You must own this FLOWER in order to sacrifice it.'
            );
        });

        it('BurnFive: Burning NFTs that are not yours', async function() {
            await mockErc721.mintForMe(1, { from: accounts[0] });
            await mockErc721.mintForMe(2, { from: accounts[0] });
            await mockErc721.mintForMe(3, { from: accounts[0] });
            await mockErc721.mintForMe(4, { from: accounts[0] });
            await mockErc721.mintForMe(5, { from: accounts[1] });

            await mockErc721.setApprovalForAll(sacrifice.address, true, {
                from: accounts[0],
            });

            await truffleAssert.reverts(
                burnFive(accounts[0], 1, 2, 3, 4, 5),
                'FlowerSacrifice: You must own this FLOWER in order to sacrifice it.'
            );
        });

        it('BurnTwo: Burning NFTs that are not yours – Test 2', async function() {
            await mockErc721.mintForMe(1, { from: accounts[0] });
            await mockErc721.mintForMe(2, { from: accounts[0] });

            await mockErc721.setApprovalForAll(sacrifice.address, true, {
                from: accounts[0],
            });

            await truffleAssert.reverts(
                burnTwo(accounts[1], 1, 2),
                'FlowerSacrifice: You must own this FLOWER in order to sacrifice it.'
            );
        });

        it('BurnThree: Burning NFTs that are not yours – Test 2', async function() {
            await mockErc721.mintForMe(1, { from: accounts[0] });
            await mockErc721.mintForMe(2, { from: accounts[0] });
            await mockErc721.mintForMe(3, { from: accounts[0] });

            await mockErc721.setApprovalForAll(sacrifice.address, true, {
                from: accounts[0],
            });

            await truffleAssert.reverts(
                burnThree(accounts[1], 1, 2, 3),
                'FlowerSacrifice: You must own this FLOWER in order to sacrifice it.'
            );
        });

        it('BurnFour: Burning NFTs that are not yours – Test 2', async function() {
            await mockErc721.mintForMe(1, { from: accounts[0] });
            await mockErc721.mintForMe(2, { from: accounts[0] });
            await mockErc721.mintForMe(3, { from: accounts[0] });
            await mockErc721.mintForMe(4, { from: accounts[0] });

            await mockErc721.setApprovalForAll(sacrifice.address, true, {
                from: accounts[0],
            });

            await truffleAssert.reverts(
                burnFour(accounts[1], 1, 2, 3, 4),
                'FlowerSacrifice: You must own this FLOWER in order to sacrifice it.'
            );
        });

        it('BurnFive: Burning NFTs that are not yours – Test 2', async function() {
            await mockErc721.mintForMe(1, { from: accounts[0] });
            await mockErc721.mintForMe(2, { from: accounts[0] });
            await mockErc721.mintForMe(3, { from: accounts[0] });
            await mockErc721.mintForMe(4, { from: accounts[0] });
            await mockErc721.mintForMe(5, { from: accounts[0] });

            await mockErc721.setApprovalForAll(sacrifice.address, true, {
                from: accounts[0],
            });

            await truffleAssert.reverts(
                burnFive(accounts[1], 1, 2, 3, 4, 5),
                'FlowerSacrifice: You must own this FLOWER in order to sacrifice it.'
            );
        });

        it('BurnOne: Lack of approval', async function() {
            await mockErc721.mintForMe(1, { from: accounts[0] });

            await truffleAssert.reverts(
                burnOne(accounts[0], 1),
                'You must approve FLOWERs before sacrificing them.'
            );
        });

        it('BurnTwo: Lack of approval', async function() {
            await mockErc721.mintForMe(1, { from: accounts[0] });
            await mockErc721.mintForMe(2, { from: accounts[0] });

            await truffleAssert.reverts(
                burnTwo(accounts[0], 1, 2),
                'You must approve FLOWERs before sacrificing them.'
            );
        });

        it('BurnThree: Lack of approval', async function() {
            await mockErc721.mintForMe(1, { from: accounts[0] });
            await mockErc721.mintForMe(2, { from: accounts[0] });
            await mockErc721.mintForMe(3, { from: accounts[0] });

            await truffleAssert.reverts(
                burnThree(accounts[0], 1, 2, 3),
                'You must approve FLOWERs before sacrificing them.'
            );
        });

        it('BurnFour: Lack of approval', async function() {
            await mockErc721.mintForMe(1, { from: accounts[0] });
            await mockErc721.mintForMe(2, { from: accounts[0] });
            await mockErc721.mintForMe(3, { from: accounts[0] });
            await mockErc721.mintForMe(4, { from: accounts[0] });

            await truffleAssert.reverts(
                burnFour(accounts[0], 1, 2, 3, 4),
                'You must approve FLOWERs before sacrificing them.'
            );
        });

        it('BurnFive: Lack of approval', async function() {
            await mockErc721.mintForMe(1, { from: accounts[0] });
            await mockErc721.mintForMe(2, { from: accounts[0] });
            await mockErc721.mintForMe(3, { from: accounts[0] });
            await mockErc721.mintForMe(4, { from: accounts[0] });
            await mockErc721.mintForMe(5, { from: accounts[0] });

            await truffleAssert.reverts(
                burnFive(accounts[0], 1, 2, 3, 4, 5),
                'You must approve FLOWERs before sacrificing them.'
            );
        });

        it('BurnTwo: Partial approval', async function() {
            await mockErc721.mintForMe(1, { from: accounts[0] });
            await mockErc721.mintForMe(2, { from: accounts[0] });

            await mockErc721.approve(sacrifice.address, 1, {
                from: accounts[0],
            });

            await truffleAssert.reverts(
                burnTwo(accounts[0], 1, 2),
                'You must approve FLOWERs before sacrificing them.'
            );
        });

        it('BurnThree: Partial approval', async function() {
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
                burnThree(accounts[0], 1, 2, 3),
                'You must approve FLOWERs before sacrificing them.'
            );
        });

        it('BurnFour: Partial approval', async function() {
            await mockErc721.mintForMe(1, { from: accounts[0] });
            await mockErc721.mintForMe(2, { from: accounts[0] });
            await mockErc721.mintForMe(3, { from: accounts[0] });
            await mockErc721.mintForMe(4, { from: accounts[0] });

            await mockErc721.approve(sacrifice.address, 1, {
                from: accounts[0],
            });
            await mockErc721.approve(sacrifice.address, 2, {
                from: accounts[0],
            });
            await mockErc721.approve(sacrifice.address, 3, {
                from: accounts[0],
            });

            await truffleAssert.reverts(
                burnFour(accounts[0], 1, 2, 3, 4),
                'You must approve FLOWERs before sacrificing them.'
            );
        });

        it('BurnFive: Partial approval', async function() {
            await mockErc721.mintForMe(1, { from: accounts[0] });
            await mockErc721.mintForMe(2, { from: accounts[0] });
            await mockErc721.mintForMe(3, { from: accounts[0] });
            await mockErc721.mintForMe(4, { from: accounts[0] });
            await mockErc721.mintForMe(5, { from: accounts[0] });

            await mockErc721.approve(sacrifice.address, 1, {
                from: accounts[0],
            });
            await mockErc721.approve(sacrifice.address, 2, {
                from: accounts[0],
            });
            await mockErc721.approve(sacrifice.address, 3, {
                from: accounts[0],
            });
            await mockErc721.approve(sacrifice.address, 4, {
                from: accounts[0],
            });

            await truffleAssert.reverts(
                burnFive(accounts[0], 1, 2, 3, 4, 5),
                'You must approve FLOWERs before sacrificing them.'
            );
        });

        // I'm not going to support manual approval for now, only setApprovalForAll().

        // it('BurnThree: Manual full approval', async function() {
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

        //     await burnThree(accounts[0], 1, 2, 3);
        // });

        it('BurnOne: basic', async function() {
            await mockErc721.mintForMe(1, { from: accounts[0] });

            const oldBalance = await mockErc721.balanceOf(accounts[0]);
            assert(
                oldBalance == 1,
                'Not enough NFTs in mintee. Expected 1, got: ' + oldBalance
            );

            const oldOwner1 = await mockErc721.ownerOf(1);
            assert(oldOwner1 === accounts[0], 'NFTs failed to mint');

            await mockErc721.setApprovalForAll(sacrifice.address, true, {
                from: accounts[0],
            });

            const response = await burnOne(accounts[0], 1);

            const updatedBalance = await mockErc721.balanceOf(accounts[0]);
            assert(updatedBalance == 0, 'Mintee has nonzero balance.');
        });

        it('BurnTwo: basic', async function() {
            await mockErc721.mintForMe(1, { from: accounts[0] });
            await mockErc721.mintForMe(2, { from: accounts[0] });

            const oldBalance = await mockErc721.balanceOf(accounts[0]);
            assert(
                oldBalance == 2,
                'Not enough NFTs in mintee. Expected 2, got: ' + oldBalance
            );

            const oldOwner1 = await mockErc721.ownerOf(1);
            const oldOwner2 = await mockErc721.ownerOf(2);
            assert(oldOwner1 === accounts[0], 'NFTs failed to mint');
            assert(oldOwner2 === accounts[0], 'NFTs failed to mint');

            await mockErc721.setApprovalForAll(sacrifice.address, true, {
                from: accounts[0],
            });

            const response = await burnTwo(accounts[0], 1, 2);

            const updatedBalance = await mockErc721.balanceOf(accounts[0]);
            assert(updatedBalance == 0, 'Mintee has nonzero balance.');
        });

        it('BurnThree: basic', async function() {
            await mockErc721.mintForMe(1, { from: accounts[0] });
            await mockErc721.mintForMe(2, { from: accounts[0] });
            await mockErc721.mintForMe(3, { from: accounts[0] });

            const oldBalance = await mockErc721.balanceOf(accounts[0]);
            assert(
                oldBalance == 3,
                'Not enough NFTs in mintee. Expected 3, got: ' + oldBalance
            );

            const oldOwner1 = await mockErc721.ownerOf(1);
            const oldOwner2 = await mockErc721.ownerOf(2);
            const oldOwner3 = await mockErc721.ownerOf(3);
            assert(oldOwner1 === accounts[0], 'NFTs failed to mint');
            assert(oldOwner2 === accounts[0], 'NFTs failed to mint');
            assert(oldOwner3 === accounts[0], 'NFTs failed to mint');

            await mockErc721.setApprovalForAll(sacrifice.address, true, {
                from: accounts[0],
            });

            const response = await burnThree(accounts[0], 1, 2, 3);

            const updatedBalance = await mockErc721.balanceOf(accounts[0]);
            assert(updatedBalance == 0, 'Mintee has nonzero balance.');
        });

        it('BurnFour: basic', async function() {
            await mockErc721.mintForMe(1, { from: accounts[0] });
            await mockErc721.mintForMe(2, { from: accounts[0] });
            await mockErc721.mintForMe(3, { from: accounts[0] });
            await mockErc721.mintForMe(4, { from: accounts[0] });

            const oldBalance = await mockErc721.balanceOf(accounts[0]);
            assert(
                oldBalance == 4,
                'Not enough NFTs in mintee. Expected 4, got: ' + oldBalance
            );

            const oldOwner1 = await mockErc721.ownerOf(1);
            const oldOwner2 = await mockErc721.ownerOf(2);
            const oldOwner3 = await mockErc721.ownerOf(3);
            const oldOwner4 = await mockErc721.ownerOf(4);
            assert(oldOwner1 === accounts[0], 'NFTs failed to mint');
            assert(oldOwner2 === accounts[0], 'NFTs failed to mint');
            assert(oldOwner3 === accounts[0], 'NFTs failed to mint');
            assert(oldOwner4 === accounts[0], 'NFTs failed to mint');

            await mockErc721.setApprovalForAll(sacrifice.address, true, {
                from: accounts[0],
            });

            const response = await burnFour(accounts[0], 1, 2, 3, 4);

            const updatedBalance = await mockErc721.balanceOf(accounts[0]);
            assert(updatedBalance == 0, 'Mintee has nonzero balance.');
        });

        it('BurnFive: basic', async function() {
            await mockErc721.mintForMe(1, { from: accounts[0] });
            await mockErc721.mintForMe(2, { from: accounts[0] });
            await mockErc721.mintForMe(3, { from: accounts[0] });
            await mockErc721.mintForMe(4, { from: accounts[0] });
            await mockErc721.mintForMe(5, { from: accounts[0] });

            const oldBalance = await mockErc721.balanceOf(accounts[0]);
            assert(
                oldBalance == 5,
                'Not enough NFTs in mintee. Expected 5, got: ' + oldBalance
            );

            const oldOwner1 = await mockErc721.ownerOf(1);
            const oldOwner2 = await mockErc721.ownerOf(2);
            const oldOwner3 = await mockErc721.ownerOf(3);
            const oldOwner4 = await mockErc721.ownerOf(4);
            const oldOwner5 = await mockErc721.ownerOf(5);
            assert(oldOwner1 === accounts[0], 'NFTs failed to mint');
            assert(oldOwner2 === accounts[0], 'NFTs failed to mint');
            assert(oldOwner3 === accounts[0], 'NFTs failed to mint');
            assert(oldOwner4 === accounts[0], 'NFTs failed to mint');
            assert(oldOwner5 === accounts[0], 'NFTs failed to mint');

            await mockErc721.setApprovalForAll(sacrifice.address, true, {
                from: accounts[0],
            });

            const response = await burnFive(accounts[0], 1, 2, 3, 4, 5);

            const updatedBalance = await mockErc721.balanceOf(accounts[0]);
            assert(updatedBalance == 0, 'Mintee has nonzero balance.');
        });

        it('BurnOne: make sure other nfts dont get burned', async function() {
            await mockErc721.mintForMe(1, { from: accounts[0] });

            await secondMockErc721.mintForMe(1, { from: accounts[0] });

            await mockErc721.setApprovalForAll(sacrifice.address, true, {
                from: accounts[0],
            });

            const newOwner1 = await secondMockErc721.ownerOf(1);
            assert(
                newOwner1 === accounts[0],
                'NFTs from another contract were burned!'
            );
        });

        it('BurnTwo: make sure other nfts dont get burned', async function() {
            await mockErc721.mintForMe(1, { from: accounts[0] });
            await mockErc721.mintForMe(2, { from: accounts[0] });

            await secondMockErc721.mintForMe(1, { from: accounts[0] });
            await secondMockErc721.mintForMe(2, { from: accounts[0] });

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
        });

        it('BurnThree: make sure other nfts dont get burned', async function() {
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

        it('BurnFour: make sure other nfts dont get burned', async function() {
            await mockErc721.mintForMe(1, { from: accounts[0] });
            await mockErc721.mintForMe(2, { from: accounts[0] });
            await mockErc721.mintForMe(3, { from: accounts[0] });
            await mockErc721.mintForMe(4, { from: accounts[0] });

            await secondMockErc721.mintForMe(1, { from: accounts[0] });
            await secondMockErc721.mintForMe(2, { from: accounts[0] });
            await secondMockErc721.mintForMe(3, { from: accounts[0] });
            await secondMockErc721.mintForMe(4, { from: accounts[0] });

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
            const newOwner4 = await secondMockErc721.ownerOf(4);
            assert(
                newOwner4 === accounts[0],
                'NFTs were not sent to burn address'
            );
        });

        it('BurnFive: make sure other nfts dont get burned', async function() {
            await mockErc721.mintForMe(1, { from: accounts[0] });
            await mockErc721.mintForMe(2, { from: accounts[0] });
            await mockErc721.mintForMe(3, { from: accounts[0] });
            await mockErc721.mintForMe(4, { from: accounts[0] });
            await mockErc721.mintForMe(5, { from: accounts[0] });

            await secondMockErc721.mintForMe(1, { from: accounts[0] });
            await secondMockErc721.mintForMe(2, { from: accounts[0] });
            await secondMockErc721.mintForMe(3, { from: accounts[0] });
            await secondMockErc721.mintForMe(4, { from: accounts[0] });
            await secondMockErc721.mintForMe(5, { from: accounts[0] });

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
            const newOwner4 = await secondMockErc721.ownerOf(4);
            assert(
                newOwner4 === accounts[0],
                'NFTs were not sent to burn address'
            );
            const newOwner5 = await secondMockErc721.ownerOf(5);
            assert(
                newOwner5 === accounts[0],
                'NFTs were not sent to burn address'
            );
        });
    });
});
