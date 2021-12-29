import { Controller } from "@hotwired/stimulus"
import { prpABI } from 'prp_abi'

export default class extends Controller {
  static targets = [
    // Connection related
    "connectedDiv", "actionButton", "disconnectedDiv", // "address", "balance", "prpBalance",
    // Props related
    "proppedDiv"
  ];

  tokenContractAddress = "0x9D35FFf07fA008399249AC58470e39E14f1f27B2";
  contractWithSigner = null;

  async connect() {
    ethereum.on('chainChanged', (chainId) => {
      // Force a reload
      window.location.reload();
    });

    ethereum.on('accountsChanged', (accounts) => {
      // Force a reload
      window.location.reload();
    });

    // Check if we are on fantom mainnet (and connected with any account)
    const accounts = await ethereum.request({method: 'eth_accounts'});
    if(ethereum.isConnected() && accounts.length > 0 && ethereum.networkVersion == "250"){
      await this.handleConnected();
    } else if (ethereum.isConnected() && accounts.length > 0) {
      this.button_switchToFantom();
      this.connectedDivTarget.style.visibility = "hidden";
    } else {
      this.button_connectToMM();
      this.connectedDivTarget.style.visibility = "hidden";
    }
  }

  async handleConnected(){
    this.disconnectedDivTarget.style.visibility = "visible";

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(this.tokenContractAddress, prpABI, provider);
    const address = ethereum.selectedAddress;

    //const balance = await provider.getBalance(address);
    //const prpBalance = await contract.balanceOf(address);
    this.contractWithSigner = await contract.connect(signer);

    //this.addressTarget.textContent = address;
    //this.balanceTarget.textContent = ethers.utils.formatEther(balance);
    //this.prpBalanceTarget.textContent = ethers.utils.formatUnits(prpBalance, 0);

    await this.handleProps(contract, signer);
  }

  button_connectToMM(){
    this.actionButtonTarget.dataset["action"] = "web3#connectToMM"
    this.actionButtonTarget.textContent = "Connect to Metamask"
    this.actionButtonTarget.style.visibility = "visible"
  }

  button_switchToFantom(){
    this.actionButtonTarget.dataset["action"] = "web3#switchToFantom"
    this.actionButtonTarget.textContent = "Switch to Fantom"
    this.actionButtonTarget.style.visibility = "visible"
  }

  button_getPropped(){
    this.actionButtonTarget.dataset["action"] = "web3#getPropped"
    this.actionButtonTarget.textContent = "Get propped!"
    this.actionButtonTarget.style.visibility = "visible"
  }

  button_connectedToFantom() {
    this.actionButtonTarget.dataset["action"] = ""
    this.actionButtonTarget.textContent = "Connected to Fantom"
    this.actionButtonTarget.style.visibility = "hidden"
  }

  button_addPRPToMetamask() {
    this.actionButtonTarget.dataset["action"] = "web3#addPRPToMetaMask"
    this.actionButtonTarget.textContent = "Add PRP to MetaMask"
    this.actionButtonTarget.style.visibility = "visible"
  }

  async handleProps(contract, signer){
    const hasBeenPropped = await this.contractWithSigner.wasPropped();

    if(hasBeenPropped){
      this.alreadyPropped()
    } else {
      this.button_getPropped();
    }
  }

  alreadyPropped(){
    this.button_addPRPToMetamask()
    this.proppedDivTarget.style.visibility = "visible";
  }

  async getPropped(event){
    event.preventDefault();
    const actionButtonTarget = this.actionButtonTarget;
    const proppedDivTarget = this.proppedDivTarget;
    await this.contractWithSigner.getPropped()
          .then(function(resp){
            button_addPRPToMetamask();
            this.proppedDivTarget.style.visibility = "visible";
            console.log("welcome m8");
          }).catch(function(error){
            console.log(error);
          });
  }

  addPRPToMetaMask(event){
    event.preventDefault();
    ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: this.tokenContractAddress,
          symbol: 'PRP',
          decimals: 0
        }
      }
    }).then((success) => {
        if(success){
          button_connectedToFantom();
        } else {
          console.log("Something went wrong!");
        }
      }).catch(console.error);
  }

  connectToMM(event){
    event.preventDefault();
    ethereum.request({ method: 'eth_requestAccounts' });
  }

  switchToFantom(event){
    event.preventDefault();
    ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0xfa' }]
    }).then(function(value){
      // Reload the window to display everything properly
      window.location.reload();
    }).catch(function(error){
      if(error.code == 4902){
        // Trigger a network switch
        ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [ {
              chainName: 'Fantom Opera',
              chainId: '0xfa',
              rpcUrls: ['https://rpc.ftm.tools/'],
              blockExplorerUrls: ['https://ftmscan.com/'],
              nativeCurrency: {
                name: 'Fantom',
                symbol: 'FTM',
                decimals: 18
              }
            } ]
        }).catch(function(error){
          console.log(error);
        });
      }
    });
  }
}
