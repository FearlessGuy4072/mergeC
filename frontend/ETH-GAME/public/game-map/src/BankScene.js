export default class BankScene extends Phaser.Scene {
  constructor() {
    super("BankScene");

    this.walletConnected = false;
    this.provider = null;
    this.signer = null;
    this.contract = null;
  }

  preload() {
    // 🔥 Background video
    this.load.video(
      "bankBg",
      "assets/bank-bg.mp4",
      "loadeddata",
      false,
      true
    );

    // 🏦 BANK TITLE IMAGE
    this.load.image(
      "bankTitle",
      "assets/Bank-title.png" // 👈 your BANK image
    );
  }

  create() {
    const { width, height } = this.scale;

    /* =====================
       VIDEO BACKGROUND
    ====================== */
    this.bg = this.add.video(width / 2, height / 2, "bankBg");
    this.bg.setLoop(true).setMute(true).play();
    this.bg.setDisplaySize(width, height);

    /* =====================
       BANK TITLE IMAGE
    ====================== */
    this.bankTitle = this.add.image(width / 2, 90, "bankTitle");
    this.bankTitle.setOrigin(0.5);
    this.bankTitle.setScale(0.6); // 🔧 adjust if needed

    /* =====================
       SUBTITLE
    ====================== */
    this.add.text(width / 2, 150, "REWARD SHOP — EXCHANGE TOKENS", {
      fontFamily: "monospace",
      fontSize: "14px",
      color: "#8899aa",
    }).setOrigin(0.5);

    /* =====================
       TOKENS
    ====================== */
    this.tokensText = this.add.text(
      width - 40,
      40,
      `TOKENS: ${localStorage.getItem("gameTokens") || 0}`,
      {
        fontFamily: "monospace",
        fontSize: "16px",
        color: "#00ff88",
      }
    ).setOrigin(1, 0);

    /* =====================
       CONNECT WALLET
    ====================== */
    this.walletBtnText = this.createCyberButton(
      160,
      50,
      240,
      44,
      "CONNECT METAMASK",
      () => this.connectWallet()
    );

    /* =====================
       REWARDS
    ====================== */
    this.rewards = [
      {
        name: "CYBER HELMET",
        priceEth: "0.001",
        valueWei: ethers.parseEther("0.001"),
        uri: "ipfs://QmHelmet",
      },
      {
        name: "NEON SWORD",
        priceEth: "0.001",
        valueWei: ethers.parseEther("0.001"),
        uri: "ipfs://QmSword",
      },
      {
        name: "HACKER GLOVES",
        priceEth: "0.001",
        valueWei: ethers.parseEther("0.001"),
        uri: "ipfs://QmGloves",
      },
    ];

    const startX = width / 2 - 300;
    const y = height / 2 - 20;

    this.rewards.forEach((r, i) => {
      const x = startX + i * 300;
      this.createCyberCard(x, y, r, () => this.purchaseReward(r));
    });

    /* =====================
       FOOTER
    ====================== */
    this.add.text(
      width / 2,
      height - 40,
      "Payment in ETH Sepolia  •  ESC to exit",
      {
        fontFamily: "monospace",
        fontSize: "12px",
        color: "#556677",
      }
    ).setOrigin(0.5);

    /* =====================
       EXIT
    ====================== */
    this.input.keyboard.once("keydown-ESC", () => {
      this.scene.start("GameScene");
    });

    /* =====================
       RESIZE SUPPORT
    ====================== */
    this.scale.on("resize", ({ width, height }) => {
      this.bg.setPosition(width / 2, height / 2);
      this.bg.setDisplaySize(width, height);

      this.bankTitle.setPosition(width / 2, 90);
    });
  }

  /* =====================
     CONNECT WALLET
  ====================== */
  async connectWallet() {
    if (!window.ethereum) {
      alert("MetaMask not found");
      return;
    }

    try {
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();

      const address = await this.signer.getAddress();
      const network = await this.provider.getNetwork();

      if (Number(network.chainId) !== 11155111) {
        alert("Please switch to Sepolia network");
        return;
      }

      const CONTRACT_ADDRESS = "0xYOUR_CONTRACT_ADDRESS";
      const ABI = ["function buyReward(string uri) payable"];

      this.contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        ABI,
        this.signer
      );

      this.walletConnected = true;
      this.walletBtnText.setText(
        address.slice(0, 6) + "..." + address.slice(-4)
      );
      this.walletBtnText.setColor("#00ff88");
    } catch (err) {
      console.error(err);
      alert("Wallet connection failed");
    }
  }

  /* =====================
     PURCHASE
  ====================== */
  async purchaseReward(reward) {
    if (!this.walletConnected || !this.contract) {
      alert("Connect wallet first");
      return;
    }

    try {
      const tx = await this.contract.buyReward(reward.uri, {
        value: reward.valueWei,
      });

      alert("Transaction sent. Confirm in MetaMask.");
      await tx.wait();
      alert(`${reward.name} purchased successfully!`);
    } catch (err) {
      console.error(err);
      alert("Purchase failed");
    }
  }

  /* =====================
     UI HELPERS
  ====================== */
  createCyberButton(x, y, w, h, label, onClick) {
    const box = this.add
      .rectangle(x, y, w, h, 0x00ffd5, 0.1)
      .setStrokeStyle(2, 0x00ffd5)
      .setInteractive({ useHandCursor: true });

    const text = this.add.text(x, y, label, {
      fontFamily: "monospace",
      fontSize: "14px",
      color: "#00ffd5",
    }).setOrigin(0.5);

    box.on("pointerover", () => text.setColor("#ffffff"));
    box.on("pointerout", () => text.setColor("#00ffd5"));
    box.on("pointerdown", onClick);

    return text;
  }

  createCyberCard(x, y, reward, onBuy) {
    const card = this.add
      .rectangle(x, y, 220, 150, 0x0d1220, 0.9)
      .setStrokeStyle(2, 0x00ffd5, 0.6)
      .setInteractive({ useHandCursor: true });

    this.add.text(x, y - 45, reward.name, {
      fontFamily: "monospace",
      fontSize: "14px",
      color: "#00ffd5",
    }).setOrigin(0.5);

    this.add.text(x, y - 10, `${reward.priceEth} ETH`, {
      fontFamily: "monospace",
      fontSize: "12px",
      color: "#8899aa",
    }).setOrigin(0.5);

    this.add.text(x, y + 45, "PURCHASE", {
      fontFamily: "monospace",
      fontSize: "12px",
      color: "#00ff88",
    }).setOrigin(0.5);

    card.on("pointerdown", onBuy);
  }
}
