import { setInterval } from "timers/promises";

import { JsonRpcProvider,formatEther } from "ethers";
import notifier from "node-notifier";
import open from "open";

interface BalanceMap {
    [address: string]: bigint;
}

async function main() {
    


    const url = 'https://mainnet.base.org';
    const provider = new JsonRpcProvider(url);
    // BASE ADDRESSES TO WATCH GO HERE
    const addresses = ["0x41A527ea80f71B47CcD3B0c834604854DD431F64"];
    console.log("Monitoring balance of addresses:", addresses);
    // get initial balances of addresses
    const initialBalances: BalanceMap = {};
    for (const address of addresses) {
        const balance = await provider.getBalance(address);
        initialBalances[address] = balance;
    }
    console.log("Initial balances:", initialBalances);

    // monitor balances every 5 seconds
    console.log("Monitoring balances every 5 seconds...");
    console.log("-----------------------------------");

    for await (const delay of setInterval(5000)) {
        for (const address of addresses) {
            const balance = await provider.getBalance(address);
            const prettyBalance = formatEther(balance);
            console.log(`Address: ${address}, Balance: ${prettyBalance.toString()} ETH`);
            if (initialBalances[address] !== balance) {
                notifier.notify({
                    
                    message: `Balance for ${address} has changed to ${prettyBalance.toString()} ETH`,
                    
                    
                },() => {
                    // remove this if you don't want to open the browser
                    open(`https://basescan.org/address/${address}`);
                })

                
            } else {
                console.log(`Balance for ${address} has not changed.`);
                

            }


        }


    }
}

    main().then((value) => console.log(value)).catch(console.error);