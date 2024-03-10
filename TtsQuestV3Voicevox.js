class TtsQuestV3Voicevox extends Audio {
  constructor(speakerId, text, ttsQuestApiKey) {
    super();
    var params = {};
    params['key'] = ttsQuestApiKey;
    params['speaker'] = speakerId;
    params['text'] = text;
    const query = new URLSearchParams(params);
    this.#main(this, query);
  }
  #main(owner, query) {
    if (owner.src.length>0) return;
    var apiUrl = 'https://api.tts.quest/v3/voicevox/synthesis';
    fetch(apiUrl + '?' + query.toString())
    .then(response => response.json())
    .then(response => {
      if (typeof response.retryAfter !== 'undefined') {
        setTimeout(owner.#main, 1000*(1+response.retryAfter), owner, query);
      }
      //else if (typeof response.mp3StreamingUrl !== 'undefined') {
      else if (typeof response.mp3DownloadUrl !== 'undefined') {
        //owner.src = response.mp3StreamingUrl;
        var stUrl=response.audioStatusUrl;
        fetch(stUrl)
          .then(response2 => response2.json())
          .then(response2 => {
           // console.log(response2)
            if (typeof response2.isAudioReady !== 'false') {
               owner.src = response.mp3DownloadUrl;
             //  console.log(owner)
            }
            else{
            //  owner.src = response.mp3DownloadUrl;
              setTimeout(owner.#main, 5000, owner, query);
            }
          });
     
      }
      else if (typeof response.errorMessage !== 'undefined') {
        throw new Error(response.errorMessage);
      }
      else {
        throw new Error("serverError");
      }
    });
  }
}
