function create () {
    jQuery.get('data.txt', function(data) {
        words = data.split("*");
        words.shift();
        json = "{";
        words.forEach(word => {

            //getting dothraki - add ' to the elided version!!!
            if(word.startsWith("'''[[")) {
                word = word.split("]]'''");
                json = json + '"' + word[0].split("[[")[1] + '": {"dothraki": "' + word[0].split("[[")[1] + '","pronunciation": "';
                word = word[1];
            } else {
                word = word.split("'''");
                json = json + '"' + word[1] + '": {"dothraki": "' + word[1] + '","pronunciation": "';
                word = word[2];
            }

            //getting pronunciation
            if (word.startsWith(" [")) {
                word = word.slice(2);
                word = word.split(/](.*)/s);
                json = json + word[0] + '", "english": [';
                word = word[1];
            } else {
                json = json + ' ", "english": [';
            }

            //cutting <span> nonsense
            if (word.startsWith(" <span")) {
                word = word.split("</span>")[1];
            }
            
            word = word.trim();

            //getting english translations and word types
            source = [];
            count = 0;
            while(word.startsWith(":''")) {
                json = json + '{"type": "';
                word = word.slice(2);
                word = word.split(/''(.*)/s);
                json = json + word[0].slice(1) + '", "english": "';
                word = word[1];

                line = "";
                if(word.includes(":''")) {
                    line = word.split(/:''(.*)/s)[0];
                    word = ":''" + word.split(/:''(.*)/s)[1];
                } else if (word.includes(":{{")) {
                    line = word.split(/:{{(.*)/s)[0];
                    word = ":{{" + word.split(/:{{(.*)/s)[1];
                } else {
                    line = word;
                    word = "";
                }

                if (line.includes("[")) {
                    line = line.split("[");
                    json = json + line[0].trim() + '"},';
                    source[count] = line[1].trim();
                    count ++;
                } else {
                    json = json + line.trim() + '"},';
                }
                word = word.trim();
            }
            json = json.slice(0, -1);
            json = json + "],"

            //adding source if there
            if (source[0]) {
                json = json + '"source": [';
                for (let i = 0; i < source.length; i++) {
                    json = json + '"' + source[i] + '",'
                }
                json = json.slice(0, -1);
                json = json + '],';
            }

            //getting special forms if there
            if (word.startsWith(":{{Nsup|")) {
                word = word.split(/}}(.*)/s);
                json = json + '"forms": {"accusative": "' + word[0].slice(8) + '"},'
                word = word[1].trim();
            } else if (word.startsWith(":{{Vsup|")) {
                word = word.split(/}}(.*)/s);
                json = json + '"forms": {"pastSG": "' + word[0].slice(8) + '"},'
                word = word[1].trim();
            }

            //getting example sentences if there
            if (word.startsWith(":{{Hval")) {
                json = json + '"examples": [';
                while(word.startsWith(":{{Hval-quote")) {
                    word = word.split(/quote(.*)/s)[1].slice(1);
                    word = word.split("|");
                    json = json + '{"dothraki": "' + word[0] + '", "english": "' + word[1].split(/}}(.*)/s)[0] + '"';

                    word2 = "";
                    for (let i = 1; i < word.length; i++) {
                        word2 = word2 + word[i];   
                        if (i%2 == 0 || word[i].endsWith("quote")) {
                            word2 = word2 + "|";
                        }
                    }
                    word = word2;
                    word = word.split(/}}(.*)/s);
                    word = word[1].trim();

                    json = json + '},'
                }
                json = json.slice(0, -1);
                json = json + '],';
            }

            //cleaning up
            json = json.slice(0, -1);
            json = json + '},'

        });
        json = json.slice(0, -1);
        json = json + '}'
        console.log(json);
    });

    }