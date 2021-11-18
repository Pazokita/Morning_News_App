export default function(selectedLang = null, action){
    if(action.type === 'changeLanguage'){
        return action.selectedLang
    } else {
        return selectedLang
    }
}