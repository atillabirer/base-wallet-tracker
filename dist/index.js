var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
import { setInterval } from "timers/promises";
import { JsonRpcProvider, formatEther } from "ethers";
import notifier from "node-notifier";
import open from "open";
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, e_1, _b, _c;
        const url = 'https://mainnet.base.org';
        const provider = new JsonRpcProvider(url);
        // BASE ADDRESSES TO WATCH GO HERE
        const addresses = ["0x41A527ea80f71B47CcD3B0c834604854DD431F64"];
        console.log("Monitoring balance of addresses:", addresses);
        // get initial balances of addresses
        const initialBalances = {};
        for (const address of addresses) {
            const balance = yield provider.getBalance(address);
            initialBalances[address] = balance;
        }
        console.log("Initial balances:", initialBalances);
        // monitor balances every 5 seconds
        console.log("Monitoring balances every 5 seconds...");
        console.log("-----------------------------------");
        try {
            for (var _d = true, _e = __asyncValues(setInterval(5000)), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
                _c = _f.value;
                _d = false;
                const delay = _c;
                for (const address of addresses) {
                    const balance = yield provider.getBalance(address);
                    const prettyBalance = formatEther(balance);
                    console.log(`Address: ${address}, Balance: ${prettyBalance.toString()} ETH`);
                    if (initialBalances[address] == balance) {
                        notifier.notify({
                            message: `Balance for ${address} has changed to ${prettyBalance.toString()} ETH`,
                        }, () => {
                            // remove this if you don't want to open the browser
                            open(`https://basescan.org/address/${address}`);
                        });
                    }
                    else {
                        console.log(`Balance for ${address} has not changed.`);
                    }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
            }
            finally { if (e_1) throw e_1.error; }
        }
    });
}
main().then((value) => console.log(value)).catch(console.error);
