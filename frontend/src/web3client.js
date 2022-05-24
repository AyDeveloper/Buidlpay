import Caver from 'caver-js';
import { abi } from './abi';

export let buildPayContract;
export let selectedAccount;
export let initialized = false;
export let provider;

const buildPayContractAddress = "0xBa4106c1631cB3c6ac5581Cf147342301e29a2C3";
const caver = new Caver(window.klatyn);
const cav = new Caver('https://api.baobab.klaytn.net:8651/');

export const init = async () => {
    // const providerUrl = 'https://api.baobab.klaytn.net:8651/';
    // const caver = new Caver(window.klatyn);
    // const cav = new Caver('https://api.baobab.klaytn.net:8651/');
    if (window.klatyn !== 'undefined') {
        // kaikas is available;
        if (window.klaytn.networkVersion == '8217') return console.log('Change to BaoBab')
        console.log('yes defined');
        const accounts = await klaytn.enable();
        const account =  accounts[0];
        selectedAccount = accounts[0];
        provider = window['klatyn'];
        console.log(account);
        console.log(selectedAccount);
        const balance = await cav.klay.getBalance(account);
        console.log(balance);
        // console.log(balance);
        setUserInfo(account, Number(caver.utils.fromPeb(balance, 'KLAY')).toFixed(2));
        klaytn.on('accountsChanged',  async (accounts) => { 
            setUserInfo(accounts[0], Number(caver.utils.fromPeb(await cav.klay.getBalance(accounts[0]), 'KLAY')).toFixed(2));
            selectedAccount = accounts[0];
        })
    }
    
     buildPayContract = new cav.klay.Contract(abi, buildPayContractAddress);
     initialized = true;

}




const balDisp = document.querySelector('.balDisp');
const connectBtn = document.querySelector('.connect button');
// set userInfo (addrress and token bal)
function setUserInfo(account, balance) {
    connectBtn.innerText = addressShortener(account);
    balDisp.style.display = 'block'; 
    balDisp.innerHTML = `${balance} <span>KLAY</span>`;
}

// helper function for address shortener;
function addressShortener(addr) {
    return addr.slice(0, 4) + '...' + addr.slice(addr.length - 5, addr.length);
}