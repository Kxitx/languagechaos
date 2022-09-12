function inputSubmit(word) {
    var text = "";
    var results = [];
    var entry = [];
    $.getJSON('dict-test.json')
        .done(function (tìeyng) {
            var search = word.value.toLowerCase();
            if (search == "") {
                document.getElementById("results").innerHTML = text;
            } else {

                ///// DIREKT                WORD               SEARCH /////////

                //assume it's dothraki
                for (key in tìeyng) {
                    if (search.length>2) {
                        if (key.includes(search)) {
                            results.push(tìeyng[key]);
                            //text = output(tìeyng, text, key);
                        }
                    } else {
                        if (key === search) {
                            console.log(tìeyng[key]);
                            results.push(tìeyng[key]);
                            //text = output(tìeyng, text, key);
                        }
                    }
                }


                //assume it's english
                for (key in tìeyng) {
                    for (let i = 0; i < tìeyng[key].english.length; i++) {
                        if (search.length>2) {
                            if (tìeyng[key].english[i].english.includes(search)) {
                                results.push(tìeyng[key]);
                                //text = output(tìeyng, text, key);
                            }
                        } else {
                            if (tìeyng[key].english[i].english === search) {
                                results.push(tìeyng[key]);
                                //text = output(tìeyng, text, key);
                            }
                        }
                    }
                }


                //is it a conjugation?
                checkForConj(tìeyng, search, 0);


                let unique = [...new Set(results)];

                ///getting conjugation tables
                for (let i = 0; i < unique.length; i++) {
                    if (unique[i].english[0].type.startsWith("v")) {
                        unique[i] = [unique[i], getVerbConjugation(unique[i])];
                    } else if (unique[i].english[0].type.startsWith("n")) {
                        unique[i] = [unique[i], getNounDeclension(unique[i])];
                    } else {
                        unique[i] = [unique[i], "not a verb or noun"];
                    }
                }
                //console.log(unique);

                ///compile text

                for (let i = 0; i < unique.length; i++) {
                    text = output(tìeyng, text, unique[i][0].dothraki, unique[i][1]);
                }

                /// Count results
                if (unique.length > 1) {
                    text = "<p style='text-align:center;'><i><b>" + unique.length + "</b> results found.</i></p>" + text;
                } else if (unique.length == 0 && search.length>2) {
                    text = "<br><p style='text-align:center;'>Word could not be found. Either you wrote something wrong, or Tekre's script for adding the word database failed. If you are sure that your word exists, feel free to <a href='/about/#contact'>contact me!</a></p>"
                } else if (unique.length == 1) {
                    text = "<p style='text-align:center;'><i><b>" + unique.length + "</b> result found.</i></p>" + text;
                }
                document.getElementById("results").innerHTML = text;
            }

        })
}


//building the output and adding it to the results when a word has been found
function output(tìeyng, text, key, conjugations) {
    text = text + "<h4>&emsp;<b>" + tìeyng[key].dothraki + "</b> - <span style='font-weight: 400;'>[" + tìeyng[key].pronunciation + "]</span></h4><div style='margin-left:15px; margin-right:15px;'>";
    for (let i = 0; i < tìeyng[key].english.length; i++) {
        text = text + "<p style='margin-bottom:2px;'><b>" + tìeyng[key].english[i].type + "</b> - " + tìeyng[key].english[i].english + "</p>";
        if (tìeyng[key].english[i].type.startsWith("n")) {
                if (conjugations[0][2][0] == i) {
                    text = text + "<i>" + conjugations[0][2][1] + "</i><br>";
                }
                if (conjugations[0][0][0] == i) {
                    text = text + '<div class="container-fluid example"><div class="row dialog"><div class="col-sm-2"></div><div class="col-sm-2"><b>Nominative</b></div><div class="col-sm-2"><b>Accusative</b></div><div class="col-sm-2"><b>Genitive</b></div><div class="col-sm-2"><b>Allative</b></div><div class="col-sm-2"><b>Ablative</b></div></div>';
                    text = text + '<div class="row dialog"><div class="col-sm-2"><b>Singular/Plural</b></div><div class="col-sm-2">' + conjugations[0][0][1] + '</div><div class="col-sm-2">' + conjugations[0][0][2] + '</div><div class="col-sm-2">' + conjugations[0][0][3] + '</div><div class="col-sm-2">' + conjugations[0][0][4] + '</div><div class="col-sm-2">' + conjugations[0][0][5] + '</div></div>';
                    text = text + '</div><br>';
                }
                if (conjugations[0][1][0] == i) {
                    text = text + '<div class="container-fluid example"><div class="row dialog"><div class="col-sm-2"></div><div class="col-sm-2"><b>Nominative</b></div><div class="col-sm-2"><b>Accusative</b></div><div class="col-sm-2"><b>Genitive</b></div><div class="col-sm-2"><b>Allative</b></div><div class="col-sm-2"><b>Ablative</b></div></div>';
                    text = text + '<div class="row dialog"><div class="col-sm-2"><b>Singular</b></div><div class="col-sm-2">' + conjugations[0][1][1] + '</div><div class="col-sm-2">' + conjugations[0][1][3] + '</div><div class="col-sm-2">' + conjugations[0][1][5] + '</div><div class="col-sm-2">' + conjugations[0][1][7] + '</div><div class="col-sm-2">' + conjugations[0][1][9] + '</div></div>';
                    text = text + '<div class="row dialog"><div class="col-sm-2"><b>Plural</b></div><div class="col-sm-2">' + conjugations[0][1][2] + '</div><div class="col-sm-2">' + conjugations[0][1][4] + '</div><div class="col-sm-2">' + conjugations[0][1][6] + '</div><div class="col-sm-2">' + conjugations[0][1][8] + '</div><div class="col-sm-2">' + conjugations[0][1][10] + '</div></div>';
                    text = text + '</div><br>';
                }
        }
    }

    if (tìeyng[key].english[0].type.startsWith("v") && tìeyng[key].english[0].type != "v. aux.") {
        text = text + '<div class="container-fluid example"><div class="row dialog"><div class="col-sm-7"><b>Present Tense Conjugation</b></div><div class="col-sm-5"><b>Negative</b></div></div>';
        text = text + '<div class="row dialog"><div class="col-sm-2"></div><div class="col-sm-2"><b>Singular</b></div><div class="col-sm-3"><b>Plural</b></div><div class="col-sm-2"><b>Singular</b></div><div class="col-sm-3"><b>Plural</b></div></div>';
        text = text + '<div class="row dialog"><div class="col-sm-2"><b>1st Person</b></div><div class="col-sm-2">' + conjugations[0][0] + '</div><div class="col-sm-3">' + conjugations[0][3] + '</div><div class="col-sm-2">' + conjugations[1][0] + '</div><div class="col-sm-3">' + conjugations[1][3] + '</div></div>';
        text = text + '<div class="row dialog"><div class="col-sm-2"><b>2st Person</b></div><div class="col-sm-2">' + conjugations[0][1] + '</div><div class="col-sm-3">' + conjugations[0][4] + '</div><div class="col-sm-2">' + conjugations[1][1] + '</div><div class="col-sm-3">' + conjugations[1][4] + '</div></div>';
        text = text + '<div class="row dialog"><div class="col-sm-2"><b>3st Person</b></div><div class="col-sm-2">' + conjugations[0][2] + '</div><div class="col-sm-3">' + conjugations[0][5] + '</div><div class="col-sm-2">' + conjugations[1][2] + '</div><div class="col-sm-3">' + conjugations[1][5] + '</div></div>';
        text = text + '</div>';
    }

    //example sentences
    if (tìeyng[key].hasOwnProperty("examples")) {
        if (tìeyng[key].examples.length > 1) {
            text = text + "<p><b>Examples:</b><br>";
        } else {
            text = text + "<p><b>Example:</b><br>";
        }
        for (let i = 0; i < tìeyng[key].examples.length; i++) {
            text = text + tìeyng[key].examples[i].dothraki + " - <i>" + tìeyng[key].examples[i].english + "</i><br></p>";
        }
    }

    //source
    if (tìeyng[key].hasOwnProperty("source")) {
        if (tìeyng[key].source.length > 1) {
            text = text + '<p style="text-align:center;">';
            for (let i = 0; i < tìeyng[key].source.length; i++) {
                text = text + '<a href="' + tìeyng[key].source + '"><b>Source ' + (i+1) + '</b></a>, ';
            }
            text = text.slice(0, -2) + '</p>';
        } else {
            text = text + '<p style="text-align:center;"><a href="' + tìeyng[key].source + '"><b>Source</b></a></p>';
        }
    }
    text = text + "</div><br>"
    return text;
}



//get verb conjugations
function getVerbConjugation(word) {
    var stem = "";
    var conjugations = [];

    //create verb stem
    if (word.dothraki.endsWith("lat")) {
        stem = word.dothraki.substring(0, word.dothraki.length - 3);
    } else {
        stem = word.dothraki.substring(0, word.dothraki.length - 2);
    }

    //present tense positive
    var present = [];
    if (word.dothraki.endsWith("lat")) {
        present[0] = stem + "k";
        present[1] = stem + "e";
        present[2] = stem + "e";
        present[3] = stem + "ki";
        present[4] = stem + "e";
        present[5] = stem + "e";
    } else {
        present[0] = stem + "ak";
        present[1] = stem + "i";
        present[2] = stem + "a";
        present[3] = stem + "aki";
        present[4] = stem + "i";
        present[5] = stem + "i";
    }
    conjugations.push(present);

    //present tense positive
    var present_neg = [];
    if (word.dothraki.endsWith("lat")) {
        present_neg[0] = stem.substring(0, stem.length - 1) + "ok";
        present_neg[1] = stem + "o";
        present_neg[2] = stem + "o";
        present_neg[3] = stem.substring(0, stem.length - 1) + "oki"
        present_neg[4] = stem + "o";
        present_neg[5] = stem + "o";
    } else {
        present_neg[0] = stem + "ok";
        present_neg[1] = stem + "i";
        present_neg[2] = stem + "o";
        present_neg[3] = stem + "oki";
        present_neg[4] = stem + "i";
        present_neg[5] = stem + "i";
    }
    conjugations.push(present_neg);




    //morphemes not shown on the dict page
    //[0] agentive nominalizer
    var morphemes = [];
    if (word.dothraki.endsWith("lat")) {
        morphemes[0] = stem + "k";
    } else {
        morphemes[0] = stem + "ak";
    }
    conjugations.push(morphemes);

    return conjugations;
}

//get noun declensions
function getNounDeclension(word) {
    var declensions = [];

    //noun cases na - [1]/[2] - nom, [3]/[4] - acc, [5]/[6] - gen, [7]/[8] - all, [9]/[10] - abl
    //noun cases ni - [1] - nom, [2] - acc, [3] - gen, [4] - all, [5] - abl
    //[0] - indicator under which english translation a declension table should be placed
    //[3] - note as help for the user regarding the declension of n.
    var onlyN = [true, false]; //[does it only has n.?][does it have n. at all?]
    cases = [[-1, "", "", "", "", ""], [-1, "", "", "", "", "", "", "", "", "", ""], [-1, ""]];

    for (let i = 0; i < word.english.length; i++) {
        if ((word.english[i].type == "ni." || word.english[i].type == "n.")) {
            if (cases[0][0] == -1) {
                //nominative
                cases[0][1] = word.dothraki;

                //accusative
                if (word.hasOwnProperty("forms") && word.forms.hasOwnProperty("accusative")) {
                    cases[0][2] = word.forms.accusative;
                } else {
                    if (word.dothraki.endsWith("a") || word.dothraki.endsWith("e") || word.dothraki.endsWith("i") || word.dothraki.endsWith("o")) {
                        cases[0][2] = doesItNeedAGoddamnE(word.dothraki.substring(0, word.dothraki.length - 1));

                    } else {
                        cases[0][2] = word.dothraki;
                    }
                }

                //genitive
                if (word.dothraki.endsWith("a") || word.dothraki.endsWith("e") || word.dothraki.endsWith("i") || word.dothraki.endsWith("o")) {
                    cases[0][3] = word.dothraki.substring(0, word.dothraki.length - 1) + "i";
                } else {
                    cases[0][3] = word.dothraki + "i";
                }

                //allative
                if (word.dothraki.endsWith("a") || word.dothraki.endsWith("e") || word.dothraki.endsWith("i") || word.dothraki.endsWith("o")) {
                    cases[0][4] = word.dothraki.substring(0, word.dothraki.length - 1) + "aan";
                } else {
                    cases[0][4] = word.dothraki + "aan";
                }

                //ablative
                if (word.dothraki.endsWith("a") || word.dothraki.endsWith("e") || word.dothraki.endsWith("i") || word.dothraki.endsWith("o")) {
                    cases[0][5] = word.dothraki.substring(0, word.dothraki.length - 1) + "oon";
                } else {
                    cases[0][5] = word.dothraki + "oon";
                }
            }

            //random stuff because I'm making this to complicated I actually already forgot what most of this stuff is about but let's leave it in to not break everything
            if (word.english[i].type == "ni.") {
                cases[0][0] = i;
                onlyN[0] = false;
            } else {
                onlyN[1] = true;
                cases[2][0] = i;
            }
        }

        if ((word.english[i].type == "na." || word.english[i].type == "n.")) {
            if (cases[1][0] == -1) {

                //nominative
                cases[1][1] = word.dothraki;

                if (word.dothraki.endsWith("a") || word.dothraki.endsWith("e") || word.dothraki.endsWith("i") || word.dothraki.endsWith("o")) {
                    cases[1][2] = word.dothraki + "si";
                } else {
                    cases[1][2] = word.dothraki + "i";
                }

                //accusative
                if (word.dothraki.endsWith("i") && (word.dothraki[word.dothraki.length - 1] == "i" || word.dothraki[word.dothraki.length - 1] == "a" || word.dothraki[word.dothraki.length - 1] == "e" || word.dothraki[word.dothraki.length - 1] == "o")) {
                    //triggers -Vi exception
                    cases[1][3] = word.dothraki.substring(0, word.dothraki.length - 1) + "yes";
                    cases[1][4] = word.dothraki.substring(0, word.dothraki.length - 1) + "yes";
                } else {
                    cases[1][3] = word.dothraki + "es";

                    if (word.dothraki.endsWith("a") || word.dothraki.endsWith("e") || word.dothraki.endsWith("i") || word.dothraki.endsWith("o")) {
                        cases[1][4] = word.dothraki + "es";
                    } else {
                        cases[1][4] = word.dothraki + "is";
                    }
                }

                //genitive
                cases[1][5] = cases[1][2];
                cases[1][6] = cases[1][2]

                //allative
                if (word.dothraki.endsWith("a") || word.dothraki.endsWith("e") || word.dothraki.endsWith("i") || word.dothraki.endsWith("o")) {
                    cases[1][7] = word.dothraki + "saan";
                    cases[1][8] = word.dothraki + "sea";
                } else {
                    cases[1][7] = word.dothraki + "aan";
                    cases[1][8] = word.dothraki + "ea";
                }

                //ablative
                if (word.dothraki.endsWith("a") || word.dothraki.endsWith("e") || word.dothraki.endsWith("i") || word.dothraki.endsWith("o")) {
                    cases[1][9] = word.dothraki + "soon";
                    cases[1][10] = word.dothraki + "soa";
                } else {
                    cases[1][9] = word.dothraki + "oon";
                    cases[1][10] = word.dothraki + "oa";
                }
            }

            if (word.english[i].type == "na.") {
                cases[1][0] = i;
                onlyN[0] = false;
            } else {
                onlyN[1] = true;
                cases[2][0] = i;
            }
        }
    }

    if (cases[0][0] == -1 && onlyN[1]) {
        cases[0][0] = word.english.length - 1;
    }
    if (cases[1][0] == -1 && onlyN[1]) {
        cases[1][0] = word.english.length - 1;
    }
    if (onlyN[1] && onlyN[0]) {
        cases[2][1] = "Note that for nouns marked as <b>n.</b> we don't know if they are inanimate or animate. Therefore this dictionary gives both declension tables."
    } else if (onlyN[1] && !onlyN[0]) {
        cases[2][1] = "Note that for nouns marked as <b>n.</b> we don't know if they are inanimate or animate. You can use both declension tables, the one under this definition as well as the one under the other definition.";
    }
    //console.log(word.dothraki);
    //console.log(cases);
    //console.log(onlyN);
    declensions.push(cases);
    return declensions;

}

function doesItNeedAGoddamnE(stem) {
    if (stem.endsWith("g") || stem.endsWith("w") || stem.endsWith("q")) {
        return stem + "e";
    }

    if (stem[stem.length] == stem[stem.length - 1] || stem[stem.length - 1] == stem[stem.length - 2]) {
        return stem + "e";
    }
    if (stem.endsWith("w") || stem.endsWith("r") || stem.endsWith("l") || stem.endsWith("l")) {
        if (!stem.endsWith("a") && !stem.endsWith("e") && !stem.endsWith("i") && !stem.endsWith("o")) {
            return stem + "e";
        }
    }
    return stem;
}

function checkForConj(dict, word, type) {
    //type: 0 - any type (always used in first cycle to ensure everything gets found), 1 - v, 2 - n

    //noun declensions
    if (type == 0 || type == 1) {

        //check for accusative
        //inanimate - was a vowel cut (and maybe an "e" added)?
        var correction = "";
        if ((!word.endsWith("a") && !word.endsWith("e") && !word.endsWith("i") && !word.endsWith("o")) || word.endsWith("e")) {
            for (key in dict) {
                if ((key == word + "e" || key == word + "a" || key == word + "i" || key == word + "o" || key == word.substring(0,word.length-1) + "e" || key == word.substring(0,word.length-1) + "a" || key == word.substring(0,word.length-1) + "i" || key == word.substring(0,word.length-1) + "o") && !key.includes(word)) {
                    conjugations = getNounDeclension(dict[key]);
                    correction = "You used a conjugation only used for inanimate nouns, but this noun is animate! The correct singular accusative of <b>" + dict[key].dothraki + "</b> is <b>" + conjugations[0][1][3] + "</b> instead of " + word + ".";
                    if (conjugations[0][1][3] != conjugations[0][1][4]) {
                        correction = correction + "The plural accusative is <b>" + conjugations[0][1][4] + "</b>." 
                    }
                    //determine if at least one of the meanings is na.
                    for (let i = 0; i < dict[key].english.length; i++) {
                        if (dict[key].english[i].type != "na.") {
                            correction = "";
                        }                       
                    } 
                    if (correction == "" && conjugations[0][0][2] != word) {
                        correction = "Your declension is slightly of - the correct accusative of <b>" + dict[key].dothraki + "</b> is <b>" + conjugations[0][0][2] + "</b>.";
                    }
                } else if (key == word.substring(0, word.length-1) && word.endsWith("e")) {
                    conjugations = getNounDeclension(dict[key]);
                    if(conjugations[0][0][2] && conjugations[0][1][3]) {
                        correction = "The accusative of this word doesn't need an <i>e</i>. The correct accusative is either <b>" + conjugations[0][0][2] + "</b> for both singular or plural if you are using the inanimate noun declension, or <b>";
                        if (conjugations[0][1][3] != conjugations[0][1][4]) {
                            correction = correction + conjugations[0][1][3] + "</b> for singular and <b>" + conjugations[0][1][4] + "</b> for plural if you use the animate noun declension."; 
                        } else {
                            correction = correction + conjugations[0][1][3] + "</b> for singular and plural if you use the animate noun declension.";
                        }
                    } else if (conjugations[0][0][2]) {
                        correction = "The accusative of this word doesn't need an <i>e</i>. The correct accusative is <b>" + conjugations[0][0][2] + "</b> for both singular or plural.";
                    } else {
                        if (conjugations[0][1][3] != conjugations[0][1][4]) {
                            correction = "The accusative of this word doesn't need an <i>e</i>. The correct accusative is <b>" + conjugations[0][1][3] + "</b> for singular and <b>" + conjugations[0][1][4] + "</b> for plural."; 
                        } else {
                            correction = "The accusative of this word doesn't need an <i>e</i>. The correct accusative for singular and plural is <b>" + conjugations[0][1][3] + "</b>.";
                        }
                    }
                }
            } 
        }

        //animate - es/is ending, -yes ending
        if (word.endsWith("es")) {
            for (key in dict) {
                if (key == dict.substring(0, word.length-2)) {
                    conjugations = getNounDeclension(dict[key]);

                    correction = "You used a conjugation only used for animate nouns, but this noun is inanimate! The correct accusative of <b>" + dict[key].dothraki + "</b> is <b>" + conjugations[0][0][2] + "</b> instead of " + word + ".";
                    for (let i = 0; i < dict[key].english.length; i++) {
                        if (dict[key].english[i].type != "ni.") {
                            correction = "";
                        }                       
                    } 

                    //test if it is sg or sg/pl - useless for now, but needed later
                    if (!dict[key].endsWith("a") && !dict[key].endsWith("e") && !dict[key].endsWith("i") && !dict[key].endsWith("o")) {
                        //it is only sg!
                    } else {
                        //it is sg and plural!
                    }

                    if (dict[key].endsWith("i") && (dict[key][dict[key].length-1] == "e" || dict[key][dict[key].length-1] == "a" || dict[key][dict[key].length-1] == "o")) {
                        //Noun needs -yes
                        if (word.endsWith("iyes")) {
                            correction = "Your declension is slightly of - the correct accusative of <b>" + dict[key].dothraki + "</b> is <b>" + conjugations[0][0][2] + "</b> because the <b>y</<b> replaces the <b>i</b> if a noun ends with that preceeded by another vowel.";
                        } else if (!word.endsWith("yes")) {
                            correction = "Your declension is slightly of - the correct accusative of <b>" + dict[key].dothraki + "</b> is <b>" + conjugations[0][0][2] + "</b> because the <b>i</<b> gets replaced by an <b>i</b> if a noun ends with that vowel preceeded by another vowel.";
                        }
                    }

                    if (correction == "" && (conjugations[0][1][3] != word || conjugations[0][1][4] != word)) {
                        if (conjugations[0][1][3] != conjugations[0][1][4]) {
                            correction = "Your declension is slightly of. The correct accusative is <b>" + conjugations[0][1][3] + "</b> for singular and <b>" + conjugations[0][1][4] + "</b> for plural."; 
                        } else {
                            correction = "Your declension is slightly of. The correct accusative for singular and plural is <b>" + conjugations[0][1][3] + "</b>.";
                        }
                    }

                    if (correction == "") {
                        correction = word + "is the correct accusative of " + dict[key];
                    }
                }
            }
        } else if (word.endsWith("is")) {
            if (key == dict.substring(0, word.length-2)) {
                //acc pl.
                //does it can take -is? animate + Noun stem consonant
            }
        }
        console.log(correction);

    }

}


