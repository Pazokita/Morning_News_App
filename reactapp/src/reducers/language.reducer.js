export default function(selectedLang = null, action){
    if(action.type === 'changeLanguage'){
        console.log('reducer langue: ' + action.selectedLang);
        return action.selectedLang
    } else {
        return selectedLang
    }
}