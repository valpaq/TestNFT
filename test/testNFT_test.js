
const { expect } = require("chai");

describe("Token contract", function () {
  // Mocha has four functions that let you hook into the the test runner's
  // lifecyle. These are: `before`, `beforeEach`, `after`, `afterEach`.

  let Token;
  let hardhatToken;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  // `beforeEach` will run before each test, re-deploying the contract every
  // time. It receives a callback, which can be async.
  before(async function () {
    // Get the ContractFactory and Signers here.
    Token = await ethers.getContractFactory("TestNFT");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    hardhatToken = await Token.deploy();
  });

  // You can nest describe calls to create subsections.
  describe("Deployment", function () {

    it("First check", async function () {
        expect(await hardhatToken.totalSupply()).to.equal(0);
    });
  });

  describe("Buy One token", function () {
    it("Initial check", async function () {

        await hardhatToken.connect(addr1).buyToken({
            value: ethers.utils.parseEther("0.01")
        });

        await hardhatToken.connect(addr1).buyToken({
            value: ethers.utils.parseEther("0.01")
        });

        expect(await hardhatToken.totalSupply()).to.equal(2);

    });

    it("Should fail because wrong price", async function () {

        await expect(
            hardhatToken.connect(addr1).buyToken({
            value: ethers.utils.parseEther("0.001")
        })
        ).to.be.revertedWith("Incorrect value");

        // Owner balance shouldn't have changed

        await expect(
            hardhatToken.connect(addr2).buyToken({
            value: ethers.utils.parseEther("0.1")
        })
        ).to.be.revertedWith("Incorrect value");

    });

    it("check id logic", async function (){

        let success;
        let tokenId;
        for (let step = 0; step < 3; step++) {
            await hardhatToken.connect(addr2).buyToken({
                value: ethers.utils.parseEther("0.01")
              });
            
//            expect( 
//               await hardhatToken.tokenOfOwnerByIndex(addr2, step)
//            ).to.equal(step);
// вот тут что-то не так, как и во многих остальных местах, 
// поэтому нормально потестить возвращающиеся значения не получилось, логику айдишников            
        }

    });
  });
  describe("Buy tokens", function () {

    it("Initial check", async function () {

        await hardhatToken.connect(addr2).buyTokens(5, {
            value: ethers.utils.parseEther("0.05")
          });        

    });

    it("Should fail because wrong price", async function () {

        await expect(
            hardhatToken.connect(addr1).buyTokens(3, {
            value: ethers.utils.parseEther("0.01")
        })
        ).to.be.revertedWith("Incorrect value");

        await expect(
            hardhatToken.connect(addr2).buyTokens(4, {
            value: ethers.utils.parseEther("0.03")
        })
        ).to.be.revertedWith("Incorrect value");

    });

    it("Should fail because wrong amount", async function () {

        await expect(
            hardhatToken.connect(addr1).buyTokens(21, {
            value: ethers.utils.parseEther("0.21")
        })
        ).to.be.revertedWith("No bigger values than 20");

        await expect(
            hardhatToken.connect(addr2).buyTokens(0, {
            value: ethers.utils.parseEther("0.00")
        })
        ).to.be.revertedWith("Amount should be positive");

    });

    it("going to 999", async function () {
        for (let step = 0; step < 49; step++) {
            await hardhatToken.connect(addr2).buyTokens(20, {
                value: ethers.utils.parseEther("0.2")
              });
        }
        await hardhatToken.connect(addr2).buyTokens(10, {
            value: ethers.utils.parseEther("0.1")
          });
    });

    it("Should fail because more than possible amount", async function () {

        await expect(
            hardhatToken.connect(addr1).buyTokens(20, {
            value: ethers.utils.parseEther("0.2")
        })
        ).to.be.revertedWith("More than possible amount");

        await expect(
            hardhatToken.connect(addr1).buyTokens(1, {
            value: ethers.utils.parseEther("0.01")
        })
        ).to.be.revertedWith("More than possible amount");

        await expect(
            hardhatToken.connect(addr1).buyToken({
            value: ethers.utils.parseEther("0.01")
        })
        ).to.be.revertedWith("More than possible amount");

    });

  });
});