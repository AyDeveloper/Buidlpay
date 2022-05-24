import firebase, { initializeApp } from 'firebase/app';
import {getFirestore, collection, getDocs, addDoc, onSnapshot, getDoc, doc} from 'firebase/firestore';
import { abi } from './abi';
// import { init, initialized, provider, buildPayContract, selectedAccount } from './web3client';
import Caver from 'caver-js';

const caver = new Caver('https://api.baobab.klaytn.net:8651/');
const cav = new Caver(klaytn);





// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBrSySVrjuyBHzPcVrbMbGZxrcir9TN-ag",
    authDomain: "buildpay-45e4b.firebaseapp.com",
    projectId: "buildpay-45e4b",
    storageBucket: "buildpay-45e4b.appspot.com",
    messagingSenderId: "1084573213405",
    appId: "1:1084573213405:web:e8cb05d0d38da6c1c87134",
    measurementId: "G-PP6ZTB7MNB"
  };

  initializeApp(firebaseConfig);

//   init database
const db = getFirestore();

// connect
const ref = collection(db, 'buidlpay');
let buidl = [];
// real time data saving
onSnapshot(ref, (snapshot) => {
    snapshot.docs.forEach( doc => {
        buidl.push(doc.id)
    })
})


onSnapshot(ref, (snap) => {
    snap.docChanges().forEach(changes => {
        const doc  = changes.doc;
                   if (changes.type === 'added') {
                       const item = doc.data();
                       displayData(item.name, item.link, item.salesPrice, item.tech, item.desc, item.addr);
                   }
    })
})
 

const projectContainerCenter = document.querySelector('.projectContainerCenter');
function displayData(name, link, salesPrice, tech, desc, addr) {
    projectContainerCenter.innerHTML += `
            <div class="projectCard">
            <div class="cardfirstDet">
                <h4>${name}</h4>
                <p>${salesPrice}-KLAY</p>
            </div>
            <a href="${link}"><p class="link">${link}</p></a>
            <p class="techUsed">${tech}</p>
            <p class="det">${desc}</p>
            <div class="voteDet">
                <button class="voteButton">Vote</button>
            </div>
            <button class="rewardBtn">Reward Buidler <span>${addressShortener(addr)}</span></button>
        </div>
    `
}

// get item to be stored on submission
let addrOfBuilder;
let amount;
const submisionForm = document.querySelector(".submisionForm");
submisionForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    let name = submisionForm.name.value;
    let link = submisionForm.link.value;
    let salePrice = submisionForm.sale.value;
    let tech = submisionForm.tech.value;
    let desc = submisionForm.desc.value;
	addrOfBuilder = selectedAccount;
	amount = salePrice;
	Register().then(tx => {
		addDoc(ref, {
			name: name,
			link:link,
			salesPrice: salePrice,
			tech: tech,
			desc: desc,
			addr: selectedAccount
		}).then()
	}).catch(err => {
		console.log(err);
	})

   


})


// vote function

const projectCardBtn = document.querySelector('.projectContainerCenter');

projectCardBtn.addEventListener('click',  e => {
	if(e.target.classList.contains('voteButton')){
		Vote(addrOfBuilder).then(tx => {

		}).catch(err => console.log(err))	

	}
})


// reward function

const projectCard = document.querySelector('.projectContainerCenter');

projectCard.addEventListener('click',  e => {
	if(e.target.classList.contains('rewardBtn')){
		RewardBuilder(addrOfBuilder).then(tx => {

		}).catch(err => console.log(err))	

	}
})


const Register = async () => {
	if (!initialized) {
		await init();
	}
	await buildPayContract.methods.Register().send({from: selectedAccount, gas: 1500000, value: 0})
}


const Vote = async (addressOfBuilder) => {
	if (!initialized) {
		await init();
	}
	await buildPayContract.methods.Vote(addressOfBuilder).send({from: selectedAccount, gas: 1500000, value:0});
}

const RewardBuilder = async (addressOfBuilder) => {
	if (!initialized) {
		await init();
	}

	await buildPayContract.methods.RewardBuidler(addressOfBuilder).send({from: selectedAccount, gas: 1500000, value: caver.utils.toPeb('1', 'KLAY')})
}


/**
 =====================================----------
 =====================================----------
                                    CONNECTING TO KLATYN
                                    ====================================
                                    ====================================
**/
const balDisp = document.querySelector('.balDisp');
// set userInfo (addrress and token bal)
function setUserInfo(account, balance) {
    connectBtn.innerText = addressShortener(account);
    balDisp.style.display = 'block'; 
    balDisp.innerHTML = `${balance} <span>KLAY</span>`;
}

// connect button
const connectBtn = document.querySelector('.connect button');
connectBtn.addEventListener('click', e => {
    // checkKlaytn();
    init();
})

// helper function for address shortener;
function addressShortener(addr) {
    return addr.slice(0, 4) + '...' + addr.slice(addr.length - 5, addr.length - 1);
}

let provider;
let selectedAccount;
let initialized = false; 
let buildPayContract;
const buildPayContractAddress = "0xb44E8d6C64c51EA8CE76fE3766f3e3C19289256E";

export const init = async () => {
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




/**
 =====================================----------
 =====================================----------
                                    END OF CONNECTING TO KLATYN
                                    ====================================
                                    ====================================
**/
