const execute = input => {
    if(input.length < 1) {
        return false;
    }
    const nums = '0123456789';
    for(let i = 0; i < input.length; i++) {
        if(!nums.includes(input[i])) {
            return false;
        }
    }
    return true;
}

module.exports = execute;