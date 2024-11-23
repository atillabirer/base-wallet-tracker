import { setInterval } from "timers/promises";

import { JsonRpcProvider,formatEther } from "ethers";
import Notifier from "node-notifier";
import open,{openApp} from "open";

interface BalanceMap {
    [address: string]: bigint;
}

async function main() {
    


    const url = 'https://mainnet.base.org';
    const provider = new JsonRpcProvider(url);
    // BASE ADDRESSES TO WATCH GO HERE
    const addresses = [""];
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
            if (initialBalances[address] == balance) {
                Notifier.notify({
                    title: "Balance Changed",
                    message: `Balance for ${address} has changed to ${prettyBalance.toString()} ETH`,
                    sound: "default",
                    timeout: 5000,
                    wait: true,
                    icon: "path/to/icon.png"
                },() => open(`https://basescan.org/address/${address}`));
                
            } else {
                console.log(`Balance for ${address} has not changed.`);
                

            }


        }


    }
}

    main().then((value) => console.log(value)).catch(console.error);