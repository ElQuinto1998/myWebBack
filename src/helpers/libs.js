const helpers = {};

helpers.randomName = (cant) => {

    const possible = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let randomName = 0;
    for (let i = 0; i < cant; i++) randomName += possible.charAt(Math.floor(Math.random() * possible.length));

    return randomName;
};

module.exports = helpers;
