const categoryContainer = document.getElementById("category-container");
const plantContainer = document.getElementById("plant-container");
const cartContainer = document.getElementById("cart-container");
let cartTotal = 0;
const modalContainer = document.getElementById("modal-container");

const manageSpinner = (status) =>{
    if(status == true){
        document.getElementById("spinner").classList.remove("hidden");
        document.getElementById("plant-container").classList.add("hidden");
    }
    else{
        document.getElementById("spinner").classList.add("hidden");
        document.getElementById("plant-container").classList.remove("hidden");
    }
}

const loadCategory = () => {
    fetch('https://openapi.programming-hero.com/api/categories') 
        .then(res => res.json())
        .then(data => {
            if (data.status) {
                showCategory(data.categories);
            } else {
                console.error("Failed to fetch categories");
            }
        })
        .catch(err => {
            console.error("Error fetching categories:", err);
        });
};

const loadPlants = (id) =>{
    manageSpinner(true);
    fetch(`https://openapi.programming-hero.com/api/category/${id}`)
        .then(res => res.json())
        .then(data =>{
            if(data.status){
                showPlants(data.plants);
            }
        })
        .catch(err =>{
            console.log(err);
            manageSpinner(false);
        })
};

const loadModal = async (id) =>{
    const url = `https://openapi.programming-hero.com/api/plant/${id}`;
    const res = await fetch(url);
    const details = await res.json();  
    displayModal(details.plants);
};

const displayModal = (plants) =>{
    console.log(plants);
    modalContainer.innerHTML = `
        <div class="flex flex-col h-100 md:h-110 justify-between shadow-lg shadow-black rounded-2xl">
            <img class="w-full object-cover h-60 md:h-72 rounded-tl-xl rounded-tr-xl" src="${plants.image}" alt="">
            <div class="p-5 space-y-2">
                <h1 onclick="loadModal(${plants.id})" class="font-bold text-sm text-left">${plants.name}</h1>
                <p class="text-justify text-xs">${plants.description}</p>
                <div class="flex items-center justify-between px-1">
                    <button class="text-[#15803D] bg-[#DCFCE7] px-4 py-1 font-medium text-xs rounded-full border-none shadow-none">${plants.category}</button>
                    <p class="text-sm font-bold">৳ ${plants.price}</p>
                </div>
            </div>
        </div>`;
    document.getElementById("my_modal_5").showModal();
};

const showPlants = (plants) =>{
    plantContainer.innerHTML = "";
    plants.forEach(plant =>{
        const div = document.createElement("div");
        div.innerHTML = `
        <div class="flex flex-col h-100 md:h-110 justify-between shadow-lg shadow-black rounded-2xl bg-white">
            <img class="w-full object-cover h-48 rounded-tl-xl rounded-tr-xl" src="${plant.image}" alt="">
            <div class="p-5 space-y-2">
                <h1 onclick="loadModal(${plant.id})" class="font-bold text-sm text-left">${plant.name}</h1>
                <p class="text-justify text-xs">${plant.description}</p>
                <div class="flex items-center justify-between px-1">
                    <button class="text-[#15803D] bg-[#DCFCE7] px-4 py-1 font-medium text-xs rounded-full border-none shadow-none">${plant.category}</button>
                    <p class="text-sm font-bold">৳ ${plant.price}</p>
                </div>
                <button class="cart-button btn text-white w-full text-sm bg-[#15803D] font-medium rounded-full border-none shadow-none">Add to Cart</button>
            </div>
        </div>`;
        plantContainer.appendChild(div);
        const cartBtn = div.querySelector(".cart-button");
        cartBtn.addEventListener("click", () => {
            alert(`${plant.name} added to cart ✅`);
            const section = document.createElement("section");
            section.innerHTML = `
            <div class="flex justify-between p-5 items-center bg-[#DCFCE7] my-2 rounded-lg">
                <div>
                    <h1 class="text-sm font-bold">${plant.name}</h1>
                    <p class="text-xs ">৳ <span>${plant.price}</span></p>
                </div>
                <div>
                    <i class="fa-solid fa-xmark remove-item" style="color: #f20202;"></i>
                </div>
            </div>`;
            cartContainer.appendChild(section);
            cartTotal += Number(plant.price);
            document.getElementById("cart-total").innerText = cartTotal;
            const removeBtn = section.querySelector(".remove-item");
            removeBtn.addEventListener("click", () => {
                alert(`${plant.name} removed from cart ❌`);
                cartTotal -= Number(plant.price);
                document.getElementById("cart-total").innerText = cartTotal;
                section.remove();
            });
        });
    });
    manageSpinner(false);
}
const showCategory = (categories) => {
    categoryContainer.innerHTML = "";
    categories.forEach(cat => {
        const li = document.createElement("li");
        li.id = cat.id; 
        li.innerText = cat.category_name;
        li.className = "hover:bg-[#15803D] hover:text-white hover:rounded-lg text-center transition cursor-pointer px-2 py-1";
        categoryContainer.appendChild(li);
    });
};

categoryContainer.addEventListener("click", (e) => {
    if (e.target.tagName === "LI") {
        const allLi = categoryContainer.querySelectorAll("li");
        allLi.forEach(li => {
            li.classList.remove("bg-[#15803D]","text-white", "rounded-lg");
        });
        e.target.classList.add("bg-[#15803D]","text-white", "rounded-lg");
        const categoryId = e.target.id;
        loadPlants(categoryId);
    }
});

const showAllPlants = () =>{
    manageSpinner(true);
    fetch(`https://openapi.programming-hero.com/api/plants`)
        .then(res => res.json())
        .then(data =>{
            if(data.status){
                allPlants(data.plants);
            }
            else {
                console.error("Failed to fetch categories");
            }
        })
        .catch(err => {
            console.error("Error fetching categories:", err);
            manageSpinner(false);
        });
    
}

const allPlants = (plants) =>{
    manageSpinner(true);
    plantContainer.innerHTML = "";
    plants.forEach(plant =>{
        const div = document.createElement("div");
        div.innerHTML = `
        <div class="flex flex-col h-100 md:h-110 justify-between shadow-lg shadow-black rounded-2xl bg-white">
            <img class="w-full object-cover h-48 rounded-tl-xl rounded-tr-xl" src="${plant.image}" alt="">
            <div class="p-5 space-y-2">
                <h1 onclick="loadModal(${plant.id})" class="font-bold text-sm text-left">${plant.name}</h1>
                <p class="text-justify text-xs">${plant.description}</p>
                <div class="flex items-center justify-between px-1">
                    <button class="text-[#15803D] bg-[#DCFCE7] px-4 py-1 font-medium text-xs rounded-full border-none shadow-none">${plant.category}</button>
                    <p class="text-sm font-bold">৳ ${plant.price}</p>
                </div>
                <button class="cart-button btn text-white w-full text-sm bg-[#15803D] font-medium rounded-full border-none shadow-none">Add to Cart</button>
            </div>
        </div>`;
        plantContainer.appendChild(div);
        const cartBtn = div.querySelector(".cart-button");
        cartBtn.addEventListener("click", () => {
            alert(`${plant.name} added to cart ✅`);
            const section = document.createElement("section");
            section.innerHTML = `
            <div class="flex justify-between p-5 items-center bg-[#DCFCE7] my-2 rounded-lg">
                <div>
                    <h1 class="text-sm font-bold">${plant.name}</h1>
                    <p class="text-xs ">৳ <span>${plant.price}</span></p>
                </div>
                <div>
                    <i class="fa-solid fa-xmark remove-item" style="color: #f20202;"></i>
                </div>
            </div>`;
            cartContainer.appendChild(section);
            cartTotal += Number(plant.price);
            document.getElementById("cart-total").innerText = cartTotal;
            
            const removeBtn = section.querySelector(".remove-item");
            removeBtn.addEventListener("click", () => {
                alert(`${plant.name} removed from cart ❌`);
                cartTotal -= Number(plant.price);
                document.getElementById("cart-total").innerText = cartTotal;
                section.remove();
            });
        });
    });
    manageSpinner(false);
}
showAllPlants();
loadCategory();