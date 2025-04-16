document.addEventListener("DOMContentLoaded", function () {
    // 🔷 LOGO SWITCH ON HOVER
    const logo1 = document.querySelector(".brand-title");
    const logo2 = document.querySelector(".brand-title1");

    // document.querySelector(".brand-logo").addEventListener("mouseenter", () => {
    //     logo1.style.display = "none";
    //     logo2.style.display = "block";
    // });

    // document.querySelector(".brand-logo").addEventListener("mouseleave", () => {
    //     logo1.style.display = "block";
    //     logo2.style.display = "none";
    // });


	// <li class="">
    //                     <a class=" " href="groups.html" aria-expanded="false">
	// 						<div class="menu-icon">
	// 							<svg width="24" height="24" viewBox="0 0 24 24" fill="none"
	// 								xmlns="http://www.w3.org/2000/svg" stroke="#ffffff">
	// 								<!-- Users -->
	// 								<circle cx="8" cy="8" r="3" stroke="#ffffff" stroke-width="1.5" />
	// 								<circle cx="16" cy="8" r="3" stroke="#ffffff" stroke-width="1.5" />
	// 								<path d="M4 16C4 14 6 12 8 12C10 12 12 14 12 16" stroke="#ffffff" stroke-width="1.5"
	// 									stroke-linecap="round" />
	// 								<path d="M20 16C20 14 18 12 16 12C14 12 12 14 12 16" stroke="#ffffff"
	// 									stroke-width="1.5" stroke-linecap="round" />

	// 								<!-- Money (Dollar Coin) -->
	// 								<circle cx="12" cy="18" r="3" stroke="#ffffff" stroke-width="1.5" />
	// 								<path d="M12 17V19" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" />
	// 								<path d="M11 18H13" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" />
	// 							</svg>

	// 						</div>
	// 						<span class="nav-text">Groups</span>
	// 					</a>
	// 				</li>
	// 				<li class="">
    //                     <a class=" " href="categories.html" aria-expanded="false">
	// 						<div class="menu-icon">
	// 							<svg width="24" height="24" viewBox="0 0 24 24" fill="none"
	// 								xmlns="http://www.w3.org/2000/svg" stroke="#ffffff">
	// 								<!-- Users -->
	// 								<circle cx="8" cy="8" r="3" stroke="#ffffff" stroke-width="1.5" />
	// 								<circle cx="16" cy="8" r="3" stroke="#ffffff" stroke-width="1.5" />
	// 								<path d="M4 16C4 14 6 12 8 12C10 12 12 14 12 16" stroke="#ffffff" stroke-width="1.5"
	// 									stroke-linecap="round" />
	// 								<path d="M20 16C20 14 18 12 16 12C14 12 12 14 12 16" stroke="#ffffff"
	// 									stroke-width="1.5" stroke-linecap="round" />

	// 								<!-- Money (Dollar Coin) -->
	// 								<circle cx="12" cy="18" r="3" stroke="#ffffff" stroke-width="1.5" />
	// 								<path d="M12 17V19" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" />
	// 								<path d="M11 18H13" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" />
	// 							</svg>

	// 						</div>
	// 						<span class="nav-text">Categories</span>
	// 					</a>
	// 				</li>

    
    // 🔷 SIDEBAR TOGGLE
    const sidebar = document.querySelector(".dlabnav");

    sidebar.insertAdjacentHTML("afterbegin", `
        <div class="dlabnav-scroll">

				<ul class="metismenu" id="menu">
					<li class="">
						<a class="" href="dashboard.html" aria-expanded="false">
							<div class="menu-icon">
								<svg width="24" height="24" viewBox="0 0 24 24" fill="none"
									xmlns="http://www.w3.org/2000/svg">
									<g id="IconlyHome">
										<g id="Home">
											<path id="Home_2"
												d="M9.13478 20.7733V17.7156C9.13478 16.9351 9.77217 16.3023 10.5584 16.3023H13.4326C13.8102 16.3023 14.1723 16.4512 14.4393 16.7163C14.7063 16.9813 14.8563 17.3408 14.8563 17.7156V20.7733C14.8539 21.0978 14.9821 21.4099 15.2124 21.6402C15.4427 21.8705 15.7561 22 16.0829 22H18.0438C18.9596 22.0023 19.8388 21.6428 20.4872 21.0008C21.1356 20.3588 21.5 19.487 21.5 18.5778V9.86686C21.5 9.13246 21.1721 8.43584 20.6046 7.96467L13.934 2.67587C12.7737 1.74856 11.1111 1.7785 9.98539 2.74698L3.46701 7.96467C2.87274 8.42195 2.51755 9.12064 2.5 9.86686V18.5689C2.5 20.4639 4.04738 22 5.95617 22H7.87229C8.55123 22 9.103 21.4562 9.10792 20.7822L9.13478 20.7733Z"
												fill="#130F26" />
										</g>
									</g>
								</svg>
							</div>
							<span class="nav-text">Dashboard</span>
						</a>
					</li>
					<li class="">
                        <a class="" href="transactions.html" aria-expanded="false">
							<div class="menu-icon">
								<svg width="24" height="24" viewBox="0 0 24 24" fill="none"
									xmlns="http://www.w3.org/2000/svg" stroke="#ffffff">
									<circle cx="5.5" cy="7.5" r="1" stroke="#ffffff" />
									<path d="M8.5 6.5H19.5" stroke="#ffffff" stroke-linecap="round" />
									<path d="M8.5 8.5H14.5" stroke="#ffffff" stroke-linecap="round" />

									<circle cx="5.5" cy="12" r="1" stroke="#ffffff" />
									<path d="M8.5 11H16.5" stroke="#ffffff" stroke-linecap="round" />
									<path d="M8.5 13H15.5" stroke="#ffffff" stroke-linecap="round" />

									<circle cx="5.5" cy="16.5" r="1" stroke="#ffffff" />
									<path d="M8.5 15.5H18" stroke="#ffffff" stroke-linecap="round" />
									<path d="M8.5 17.5H12.5" stroke="#ffffff" stroke-linecap="round" />
								</svg>


							</div>
							<span class="nav-text">Transactions</span>
						</a>
					</li>
					
					<li class="">
                        <a class=" " href="banks.html" aria-expanded="false">
							<div class="menu-icon">
								<svg width="24" height="24" viewBox="0 0 24 24" fill="none"
									xmlns="http://www.w3.org/2000/svg" stroke="#ffffff">
									<!-- Bank Building (Triangle Roof) -->
									<path d="M3 8L12 3L21 8" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"
										stroke-linejoin="round" />

									<!-- Columns -->
									<path d="M5 10V18" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" />
									<path d="M9 10V18" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" />
									<path d="M15 10V18" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" />
									<path d="M19 10V18" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" />

									<!-- Base of the Bank -->
									<path d="M3 18H21" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" />

									<!-- Dollar Symbol Inside -->
									<circle cx="12" cy="13" r="2.5" stroke="#ffffff" stroke-width="1.5" />
									<path d="M12 12V14" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" />
									<path d="M11 13H13" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" />
								</svg>

							</div>
							<span class="nav-text">Bank Account</span>
						</a>
					</li>
					<li class="">
						<a class="" href="budget.html" aria-expanded="false">
							<div class="menu-icon">
								<svg width="24" height="24" viewBox="0 0 24 24" fill="none"
									xmlns="http://www.w3.org/2000/svg" stroke="#ffffff">
									<!-- Document (Budget Paper) -->
									<path
										d="M6 2H16L20 6V20C20 21.1 19.1 22 18 22H6C4.9 22 4 21.1 4 20V4C4 2.9 4.9 2 6 2Z"
										stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"
										stroke-linejoin="round" />

									<!-- Dollar Symbol -->
									<path d="M12 9V15" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" />
									<path d="M10 11H14" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" />
									<path d="M10 13H14" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" />

									<!-- Gear (Settings for Budget Setup) -->
									<circle cx="17.5" cy="17.5" r="2.5" stroke="#ffffff" stroke-width="1.5" />
									<path
										d="M17.5 14.5V12.5M17.5 20.5V22.5M14.5 17.5H12.5M20.5 17.5H22.5M15.64 15.64L14.22 14.22M19.78 15.64L21.2 14.22M15.64 19.78L14.22 21.2M19.78 19.78L21.2 21.2"
										stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" />
								</svg>

							</div>
							<span class="nav-text">Budget Setup</span>
						</a>
					</li>
				</ul>
			</div>
    `);

    const nav_header = document.querySelector(".nav-header");

    nav_header.insertAdjacentHTML("afterbegin", `
        <a href="index.html" class="brand-logo">
            <div class="logo">
                <img class="brand-title" src="images/kedil-logo-txt-wte.png" />
                <img class="brand-title1" src="images/kedil-logo-wte.png" />
            </div>

        </a>
        <div class="nav-control">
            <div class="hamburger">
                <span class="line"></span>
                <span class="line"></span>
                <span class="line"></span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path opacity="0.4"
                        d="M16.7548 0.333313H20.7051C22.341 0.333313 23.6667 1.67014 23.6667 3.31994V7.30359C23.6667 8.95339 22.341 10.2902 20.7051 10.2902H16.7548C15.1188 10.2902 13.7932 8.95339 13.7932 7.30359V3.31994C13.7932 1.67014 15.1188 0.333313 16.7548 0.333313Z"
                        fill="white" />
                    <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M3.29492 0.333313H7.24522C8.8812 0.333313 10.2068 1.67014 10.2068 3.31994V7.30359C10.2068 8.95339 8.8812 10.2902 7.24522 10.2902H3.29492C1.65894 10.2902 0.333313 8.95339 0.333313 7.30359V3.31994C0.333313 1.67014 1.65894 0.333313 3.29492 0.333313ZM3.29492 13.7097H7.24522C8.8812 13.7097 10.2068 15.0466 10.2068 16.6964V20.68C10.2068 22.3287 8.8812 23.6666 7.24522 23.6666H3.29492C1.65894 23.6666 0.333313 22.3287 0.333313 20.68V16.6964C0.333313 15.0466 1.65894 13.7097 3.29492 13.7097ZM20.705 13.7097H16.7547C15.1188 13.7097 13.7931 15.0466 13.7931 16.6964V20.68C13.7931 22.3287 15.1188 23.6666 16.7547 23.6666H20.705C22.341 23.6666 23.6666 22.3287 23.6666 20.68V16.6964C23.6666 15.0466 22.341 13.7097 20.705 13.7097Z"
                        fill="white" />
                </svg>

            </div>
        </div>
    `);

    
    const footer = document.querySelector(".footer");

    footer.insertAdjacentHTML("afterbegin", `
        <div class="copyright">
            <p>Copyright © Designed &amp; Developed by <a href="https://google.com/" target="_blank">
                    Kedil</a> 2025</p>
        </div>
    `);
});

function setToken()
{
	localStorage.setItem("AuthToken", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjdlYjczZTQ1MTI4NmMyYTAzOGIyNDA0IiwiaWF0IjoxNzQzNzc3MjAwLCJleHAiOjE3NDYzNjkyMDB9.0e21E_ld3HfTifIPv9NoQ36Ztcth-7HK5qR8TbGKGQw");
}

setToken();