import Alpine from "./node_modules/alpinejs/dist/module.esm.js";
import FormatValidatorService from "./format-validator/FormatValidator.service.js";
import NotificationService from "./notification/Notification.service.js";

window.Alpine = Alpine;

Alpine.data("login_page", () => ({
    section: "login",
    message: "",

    async submitHandler(event) {
        event.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const validator = new FormatValidatorService();
        const notifier = new NotificationService();
        try {
            // Validation des entrées
            validator.emailValidator(email);
            validator.passwordValidator(password);

            // Requête au serveur pour la connexion
            const response = await fetch("http://localhost:3000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const result = await response.json();

            if (response.ok) {
                // Redirection si l'URL de redirection est définie
                if (result.redirectUrl) {
                    console.log("Redirection vers :", result.redirectUrl);
                    window.location.href = result.redirectUrl;
                }
            } else {
                // Gestion des erreurs côté serveur
                throw new Error(result.error || "Erreur lors de la connexion.");
            }
        } catch (err) {
            // Gestion centralisée des erreurs
            console.error("Erreur dans la connexion :", err.message);
            notifier.displayNotification(err.message);
        }
    },

    async signupHandler(event) {
        const nom = document.getElementById("signup-nom").value;
        const email = document.getElementById("signup-email").value;
        const password = document.getElementById("signup-password").value;
        const confirmPassword = document.getElementById("confirm-password").value;
    
        const validator = new FormatValidatorService();
        const notifier = new NotificationService();

        try {
            // Validation des entrées
            validator.emailValidator(email);
            validator.passwordValidator(password);
            if (password !== confirmPassword) {
                throw new Error("Les mots de passe ne correspondent pas.");
            }
    
            // Requête au serveur
            const response = await fetch("http://localhost:3000/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ nom, email, password }),
            });
    
            const result = await response.json();
            if (response.ok) {
                if (result.redirectUrl) {
                    console.log("Redirection vers :", result.redirectUrl);
                    window.location.href = result.redirectUrl;}
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            // Gestion centralisée des erreurs
            this.message = error.message || "Une erreur est survenue lors de l'inscription.";
        }
    }

    
    
}
));

Alpine.data("admin",function(){
    return ({
        users: [],
        async init(){
            //this.users = await (await fetch("./data/users.json")).json
            
            try{
                const result = await fetch("../data/users.json")
                this.users=await result.json()

            }catch(e){
                console.trace(e)
            }
        }
    })
}
)

Alpine.start();
