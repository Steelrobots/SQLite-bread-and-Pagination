function confirmation(name) {
    const answer = confirm(`Apakah kamu yakin akan menghapus data '${name}'`)
    if (answer) {
        return true
    } else return false
}
function opendialog(id, name){
    document.getElementById('deleteConfirm').style.display = 'block'
    document.getElementById('dialog').innerHTML = `Are you sure you want to delete '${name}'?`
    document.getElementById('confirmed').setAttribute("href" , `/delete/${id}`)
}

function closeDialog() {
    document.getElementById('deleteConfirm').style.display = 'none';
}