function createPost(post) {
  const date = new Date(post.publishedDate).toDateString();
  return `
    <li class="blogPost" id="${post._id}">
        <h2>${post.title}</h2>
        <p>By ${post.author} at ${date}</p>
        <p>${post.content}</p>
    </li>`;
}

async function onPostClick(e) {
  e.preventDefault();

  const title = $("#txtTitle").val();
  const author = $("#txtAuthor").val();
  const content = $("#txtContent").val();
  const publishedDate = Date.now();

  console.log(title);
  console.log(author);
  console.log(content);
  console.log(publishedDate);

  const url = "/blog-posts";
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      title: title,
      author: author,
      content: content,
      publishedDate: publishedDate
    })
  });
  const json = await res.json();
  console.log(json);
  if (json.success) {
    $("#lstPosts").append(createPost(json.post));
    $("#txtTitle").val("");
    $("#txtAuthor").val("");
    $("#txtContent").val("");
  } else {
    alert(json.msg);
  }
}

async function onDeleteClick(e) {
  e.preventDefault();

  const id = $("#deleteID").val();
  const url = `/blog-posts/${id}`;
  const res = await fetch(url, {
    method: "DELETE"
  });
  const json = await res.json();

  if (json.success) {
    $("#lstPosts")
      .find(`#${id}`)
      .remove();
    $("#deleteID").val("");
  } else {
    alert(json.msg);
  }
}

async function onEditClick(event) {
  event.preventDefault();

  const title = $("#editTitle").val();
  const id = $("#editID").val();
  const author = $("#editAuthor").val();
  const content = $("#editContent").val();

  const url = `/blog-posts/${id}`;
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      id: id,
      title: title,
      content: content,
      author: author
    })
  });
  console.log(res.body.id);
  const json = await res.json();
  if (json.success) {
    $("#lstPosts")
      .find(`#${id}`)
      .replaceWith(createPost(json.post));
    $("#editTitle").val("");
    $("#editID").val("");
    $("#editAuthor").val("");
    $("#editContent").val("");
  } else {
    alert(json.error);
  }
}

async function main() {
  $("#lstPosts").html("");

  const url = "/blog-posts";
  const res = await fetch(url, {
    method: "GET"
  });
  const json = await res.json();
  json.posts.forEach(item => {
    $("#lstPosts").append(createPost(item));
  });

  // Llamar las funciones para los botones
  $("#postBtn").click(onPostClick);
  $("#editBtn").click(onEditClick);
  $("#deleteBtn").click(onDeleteClick);
}

main();
