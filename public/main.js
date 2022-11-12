
var thumbUp = document.getElementsByClassName("fa-thumbs-up");
var thumbDown = document.getElementsByClassName("fa-thumbs-down");
var trash = document.getElementsByClassName("fa-trash");
var input = document.getElementsByClassName("editable");




function updateE(element) {
    //bench press	2	3	15 mins
    // exercise
    let meal = element.closest('tr').cells[0].innerText
    let price = element.closest('tr').cells[1].innerText
    let resturant = element.closest('tr').cells[2].innerText
    let rating = element.closest('tr').cells[3].innerText
    console.log(comment)


    fetch('update', {
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        'meal': meal,
        'price': price,
        'resturant': resturant,
        'rating': rating
      })
    }).then(response => {
      if (response.ok) console.log('exercise updated')
      
    })
}
function create(element) {
  //bench press	2	3	15 mins
  // exercise
  let meal = element.closest('tr').cells[0].innerText
  let price = element.closest('tr').cells[1].innerText
  let resturant = element.closest('tr').cells[2].innerText
  let rating = element.closest('tr').cells[3].innerText
  console.log(rating)


  fetch('create', {
    method: 'post',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      'meal': meal,
      'price': price,
      'resturant': resturant,
      'rating': rating
    })
  }).then(response => {
    if (response.ok) console.log('meal updated')
    window.location.reload()
  })
}
function deleteE(name) {
  //bench press	2	3	15 mins
  // exercise
  // let meal = element.closest('tr').cells[0].innerText
  // let price = element.closest('tr').cells[1].innerText
  // let resturant = element.closest('tr').cells[2].innerText
  // let rating = element.closest('tr').cells[3].innerText
  // console.log(rating)

  console.log("Deleting....", name)

  fetch('/delete', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Accept: "application/json"
    },
    body: JSON.stringify({
      "userName": name,
    })
  }).then(response => {
    console.log(response)
    if (response.ok) {
      console.log('name updated')
      window.location.reload()
    }
  })

}


