const loadData = () => {

}
const sendFeedback = () => {
    let [title, desc] = getValuesByIds(['feedbackComment', 'feedbackDesc']);
    let isAnon = document.getElementById('feedbackAnonymousInput').checked;
    let rate = getValuesByNames(['rating'])[0].filter(e => {
        return e;
    })[0];
    if (title.length > 3) {
        if (desc.length > 5) {
            send('add', 'feedback', {
                    name: isAnon ? "Anonymous" : data.name,
                    title: title,
                    description: desc,
                    rate: rate
                })
                .then(e => {
                    alert("Thank You For Your Precious Feedback");
                    loadPage('index');
                })
        } else {
            alert("Description should be more than 5 chars");
        }
    } else {
        alert("Title should be more than 3 chars");
    }
}
