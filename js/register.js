// ******* ------------ variables declarations for register page ******* ------------
let Usernamefield = document.querySelector("#username")
let EmailField = document.querySelector("#email")
let passwordField = document.querySelector("#password")
let FormBtnField = document.querySelector("#inp-btn")

let formFields = document.querySelectorAll(".register-form .inp")
console.log(formFields)

// !!!! functions to collect data

let obj

FormBtnField.addEventListener("click", function(e) {
    e.preventDefault()
    formFields = Array.from(formFields)

    formFields.forEach(element => {
        if ( element.value.trim() !== ""){

            if ( EmailField.value.toLowerCase().includes("@gmail.com") || EmailField.value.toLowerCase().includes("@outlook.com") || EmailField.value.toLowerCase().includes("@outlook.fr")){
                if ( passwordField.includes("")){}
            }
        } 
    });
})




function validatePassword(password) {
    // تعبير منتظم للتحقق من الشروط المطلوبة
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
  
    // التحقق من كلمة المرور باستخدام التعبير المنتظم
    if (passwordRegex.test(password)) {
      console.log("كلمة المرور صالحة.");
      return true;
    } else {
      console.log("كلمة المرور غير صالحة. يجب أن تحتوي على حرف، ورقم، وحرف خاص.");
      return false;
    }
  }
  
  // اختبار الشيفرة بكلمة مرور
  validatePassword("Pass123!"); // مثال
  