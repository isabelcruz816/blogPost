function main() {
  const list = $('#postsLst');
  const url = 'http://localhost:3000/blog-posts';
  list.html('');

  console.log(list);

  $.ajax({
    url: url,
    method: 'GET',
    success: res => {
      console.log(res);
      res.posts.forEach(post => {
        list.append(`
        <li>
            <h1>${post.title}</h1>
            <h6>${post.author}</h6>
            <p>${post.content} <br> ${post.publishedDate}</p>
        </li>`);
      });
    },
    error: err => {
      alert(err.message);
    },
  });

  $('#postBtn').on('click', () => {
    event.preventDefault();

    const title = $('#title').val();
    const author = $('#author').val();
    const content = $('#txtcontent').val();
    const publishedDate = Date.now();

    $.ajax({
      url: url,
      method: 'POST',
      success: res => {
        list.append(`
        <li>
            <h1>${res.title}</h1>
            <h6>${res.author}</h6>
            <p>${res.content}</p>
        </li>`);
        $('#postLst').val('');
        $('#title').val('');
        $('#author').val('');
        $('#txtcontent').val('');
      },
      error: err => {
        alert(err.message);
      },
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify({
        title: title,
        author: author,
        content: content,
        publishedDate: publishedDate,
      }),
    });
  });
}

main();
