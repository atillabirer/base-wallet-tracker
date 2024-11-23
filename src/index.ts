import { setInterval } from "timers/promises";

import { JsonRpcProvider } from "ethers";
import Notifier from "node-notifier";

interface BalanceMap {
    [address: string]: bigint;
}

async function main() {


    const url = 'https://mainnet.base.org';
    const provider = new JsonRpcProvider(url);
    const addresses = ["0x8F479195645BEBD3b108B6062D0810B90123eb70"];
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
            console.log(`Address: ${address}, Balance: ${balance.toString()}`);
            if (initialBalances[address] !== balance) {
                Notifier.notify(`Balance for ${address} has changed!`);
                
            } else {
                console.log(`Balance for ${address} has not changed.`);
                

            }


        }


    }
}

    main().then((value) => console.log(value)).catch(console.error);