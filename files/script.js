window.addEventListener("DOMContentLoaded", async () => {
    //https://wt.ops.labs.vu.nl/api23/c590833b
    let url = "http://localhost:3000/gallery";
    let add_new_button = document.getElementById("add_new");
    let form_modal = document.getElementById("modal_form");
    let authors;
    let unique_authors = [];
    let current_author = "";
    let search_authors = [];
    let subset_authors = [];
    getAuthors();
    add_new_button.addEventListener("click", function () {
        form_modal.classList.toggle("hidden");
    });

    let close_button = document.getElementById("close");
    close_button.addEventListener("click", function () {
        form_modal.classList.toggle("hidden");
    })

    let submit_button = document.getElementById("submit");
    submit_button.addEventListener("click", async (e) => {
        e.preventDefault();
        if (!form_modal.querySelector("#form").checkValidity()) {
            alert("form incorrect");
            return;
        }

        let response = await fetch(url, {
            method: "post",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                image: form_modal.querySelector("#image").value,
                author: form_modal.querySelector("#author").value,
                alt: form_modal.querySelector("#alt").value,
                tags: form_modal.querySelector("#tags").value,
                description: form_modal.querySelector("#description").value
            })
        });
        form_modal.querySelector("#image").value = "";
        form_modal.querySelector("#author").value = "";
        form_modal.querySelector("#alt").value = "";
        form_modal.querySelector("#tags").value = "";
        form_modal.querySelector("#description").value = "";
        console.log(await response.status);
        getAuthors();
        form_modal.classList.toggle("hidden");
    })

    let reset_button = document.getElementById("reset");
    reset_button.addEventListener("click", async () => {
        let response = await fetch(url, {
            method: "delete"
        });
        console.log(await response.status);
        getAuthors();
    });

    async function getAuthors() {
        let response = await fetch(url);
        authors = await response.json();
        search_authors = authors;
        subset_authors = authors;
        console.log(await response.status);
        let infocus = document.getElementById("infocus");
        infocus.innerHTML = "";
        createGallery();
        createAuthorList();
    }

    function createGallery(items = authors) {
        let gallery = document.getElementById("gallery");
        gallery.innerHTML = ""
        for (let item of items) {
            let div = document.createElement("div");
            div.classList.add("item");
            let img = document.createElement("img");
            img.src = item.image;
            img.alt = item.alt;
            div.appendChild(img);
            div.addEventListener("click", function () {
                let infocus = document.getElementById("infocus");
                infocus.innerHTML = "";
                let img = document.createElement("img");
                img.src = item.image;
                img.alt = item.alt;
                let desc = document.createElement("p");
                desc.innerHTML = item.description;
                let tag = document.createElement("p");
                tag.innerHTML = item.tags;
                let update = document.createElement("button");
                update.innerHTML = "Update";
                let delete_b = document.createElement("button");
                delete_b.innerHTML = "Delete";
                infocus.appendChild(img);
                infocus.appendChild(desc);
                infocus.appendChild(tag);
                infocus.appendChild(update);
                infocus.appendChild(delete_b);
                delete_b.addEventListener("click", async () => {
                    let response = await fetch(`${url}/${item.id}`, {
                        method: "delete"
                    });
                    getAuthors();
                });
                update.addEventListener("click", function () {
                    let form = document.createElement("form");

                    let image = document.createElement("input");
                    let author = document.createElement("input");
                    let alt = document.createElement("input");
                    let tags = document.createElement("input");
                    let description = document.createElement("input");

                    image.type = "url";

                    image.name = "image";
                    author.name = "author";
                    alt.name = "alt";
                    tags.name = "tags";
                    description.name = "description";

                    image.value = item.image;
                    author.value = item.author;
                    alt.value = item.alt;
                    tags.value = item.tags;
                    description.value = item.description;

                    image.required = true;
                    author.required = true;
                    alt.required = true;
                    tags.required = true;
                    description.required = true;

                    form.appendChild(image);
                    form.appendChild(author);
                    form.appendChild(alt);
                    form.appendChild(tags);
                    form.appendChild(description);
                    infocus.append(form);
                    update.classList.add("hidden");

                    let button = document.createElement("button");
                    button.innerHTML = "Update";
                    infocus.append(button);
                    button.addEventListener("click", async () => {
                        if (!form.checkValidity()) {
                            alert("form incorrect");
                            return;
                        }
                        let response = await fetch(url, {
                            method: "put",
                            headers: {
                                "content-type": "application/json"
                            },
                            body: JSON.stringify({
                                id: item.id,
                                image: image.value,
                                author: author.value,
                                alt: alt.value,
                                tags: tags.value,
                                description: description.value
                            })
                        });
                        getAuthors();
                    })
                })
            })
            gallery.appendChild(div);
        }
    }

    function createAuthorList() {
        unique_authors = [];
        for (let author of authors) {
            if (!unique_authors.includes(author.author)) {
                unique_authors.push(author.author);
            }
        }
        let section = document.getElementById("author_list");
        section.innerHTML = "";
        for (let author of unique_authors) {
            let p = document.createElement("p");
            p.innerHTML = author;
            p.classList.add("author_name");
            p.addEventListener("click", function () {
                for (elem of document.getElementsByClassName("author_name")) {
                    elem.classList.remove("selected_author");
                };
                if (current_author == this.innerHTML) {
                    current_author = "";
                    subset_authors = authors;
                    createGallery(search_authors.filter(x => subset_authors.includes(x)));
                }
                else {
                    this.classList.add("selected_author");
                    current_author = this.innerHTML;
                    let images = [];
                    for (author of authors) {
                        if (this.innerHTML == author.author) {
                            images.push(author);
                        }
                    }
                    subset_authors = images;
                    createGallery(search_authors.filter(x => subset_authors.includes(x)));
                }
            })
            section.appendChild(p);
        }
    }

    let search_bar = document.getElementById("search")
    search_bar.addEventListener("keyup", function () {
        if (this.value == "") {
            search_authors = authors;
        }
        search_authors = [];
        for (let author of authors) {
            if (author.author.toLowerCase().includes(this.value.toLowerCase())) {
                search_authors.push(author)
            } else if (author.tags.toLowerCase().includes(this.value.toLowerCase())) {
                search_authors.push(author);
            }
        }
        createGallery(search_authors.filter(x => subset_authors.includes(x)));
    })
});