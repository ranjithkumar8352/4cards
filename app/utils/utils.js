import _ from "lodash";
import store from 'react-native-simple-store';

export function getNewCards(data,size) {
    let filteredData = _.filter(data, function(o) { return !o.completed; });
    let newWords = _.sampleSize(filteredData,size);
    markAsCompleted(newWords);
    return newWords;
}

export function getSingleCard(data){
    let filteredData = _.filter(data, function(o) { return !o.completed; });
    let newWord = _.sample(filteredData);
    markAsCompleted([newWord]);
    return newWord;
}

export function markAsCompleted(inputWords){
    store.get('allWords').then((allWords)=>{
        _.each(inputWords,function(word){
           let wordIndex = _.findIndex(allWords, {name: word.name});
           if(wordIndex > -1){
               let tempWord = word;
               tempWord.completed = true;
               allWords.splice(wordIndex, 1, tempWord);
           }
        });
        store.save('allWords',allWords);
    });
};