const TENT = [0.1001, 0.1002, 0.1003, 0.1004, 0.1005, 0.1006, 0.1007, 0.1008, 0.1009]
const THOU = [0.101, 0.102, 0.103, 0.104, 0.105, 0.106, 0.107, 0.108, 0.109, 0.110,
    0.111, 0.112, 0.113, 0.114, 0.115, 0.116, 0.117, 0.118, 0.119, 0.120, 0.121,
    0.122, 0.123, 0.124, 0.125, 0.126, 0.127, 0.128, 0.129, 0.130, 0.131, 0.132,
    0.133, 0.134, 0.135, 0.136, 0.137, 0.138, 0.139, 0.140, 0.141, 0.142, 0.143,
    0.144, 0.145, 0.146, 0.147, 0.148, 0.149]
const HUND = [0.050, 0.100, 0.150, 0.200, 0.250, 0.300, 0.350, 0.400, 0.450, 0.500,
    0.550, 0.600, 0.650, 0.700, 0.750, 0.800, 0.850, 0.900, 0.950]
const WHOL = [1.000, 2.000, 3.000, 4.000]

const tenk = 10000;

function limitDecimals(){
    var gageInput = document.getElementById('gage-height');
    gageInput.value = gageInput.value.match(/\d{0,2}(\.\d{0,4})?/)[0];
}

function calculateGages(){
    Decimal.config({ precision: 5})
    var gageIn = new Decimal(document.getElementById('gage-height').value)
    if(!gageIn || gageIn < 0.1 || gageIn > 8){
        alert('Height input must be a value from 0.100" to 8.000".')
        return;
    }
    gageIn = gageIn.mul(tenk)

    var block;
    const blocks = [];
    const tent = gageIn % 10;
    if(tent) {
        block = TENT[tent - 1]
        blocks.push(block.toString());
        gageIn -= block * tenk;
    }

    var thou = (gageIn / 10) % 10;
    var hund = Math.floor(gageIn / 100) % 5;
    for(var i = 0; i < 3 && (hund || thou); i++){ // needs to run more than once, but not infinitely
        if(thou || hund){
            block = "0.1" + hund + thou;
            blocks.push(block)
            gageIn -= 0.1 * tenk + hund * 100 + thou * 10;
        }
        thou = (gageIn / 10) % 10;
        hund = Math.floor(gageIn / 100) % 5;
    }

    var tens = Math.floor(gageIn / 1000) % 10;
    for(var i = 0; i < 3 && tens; i++){
        hund = Math.floor(gageIn / 100) % 10;
        if(tens){
            block = "0." + tens + hund + "0";
            blocks.push(block);
            gageIn -= tens * 1000 + hund * 100;
        }
        tens = Math.floor(gageIn / 1000) % 10;
    }

    if(gageIn >= 40000){
        blocks.push("4.000");
        gageIn -= 40000;
    }
    if(gageIn >= 30000){
        blocks.push("3.000");
        gageIn -= 30000;
    }
    if(gageIn >= 20000){
        blocks.push("2.000");
        gageIn -= 20000;
    }
    if(gageIn >= 10000){
        blocks.push("1.000");
        gageIn -= 10000;
    }
    console.log(blocks, gageIn)
    if(blocks.length && !gageIn)
        document.getElementById('gage-blocks').innerHTML = "Required gage blocks:<br /><br />"+blocks.join(' - ');
    else
        document.getElementById('gage-blocks').innerHTML = "Impossible setup.";
}

document.onkeydown=() => {
    if(window.event.keyCode == '13'){
        calculateGages();
    }
}