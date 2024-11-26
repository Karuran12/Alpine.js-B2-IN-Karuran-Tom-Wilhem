class FormatValidatorService{
    constructor(){}

    emailValidator(email){
        const pattern=new RegExp(/^[a-zA-Z0-9.\-]{2,15}[@]{1}[a-z]{2,10}[.]{1}[a-z]{2,3}/,"g")
        const isEmailValid = pattern.test(email);
        return isEmailValid

    }

    passwordValidator(pwd){
        const pattern=new RegExp(/[a-zA-Z0-9*!?éèà@]{12,30}/,"g")
        const isPasswordValid = pattern.test(pwd);
        console.log("1")

        for (const el of pwd){
            if (el ===el.toUpperCase()){
                console.log("2")
                return true
            }
        }
        console.log("3")
        throw new Error ("Il manque une majuscule dans votre mot de passe")
    }
}

export default FormatValidatorService