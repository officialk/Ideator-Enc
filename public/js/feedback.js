/*
    PSUEDO FUNCTION
*/
const loadData = () => {

}
/*
    sends the feedback to the ideator@officiak.codes
    Params:NaN
*/
const sendFeedback = () => {
    let [title, desc] = getValuesByIds(['feedbackComment', 'feedbackDesc']);
    let rate = getValuesByNames(['rating'])[0].filter(e => {
        return e;
    })[0];
    if (title.length > 3) {
        if (desc.length > 5) {
            let name = data.name;
            let subject = 'Feedback From ' + data.name;
            let body = `Title :: ${title}\nRating :: ${rate}\n\n${desc}
            `;
            let href = `mailto:ideator@officialk.codes?subject=${encodeURI(subject)}&body=${encodeURI(body)}`
            let win = window.open(href, 'parent')
            location.href = '../'
        } else {
            alert("Description should be more than 5 chars");
        }
    } else {
        alert("Title should be more than 3 chars");
    }
}
