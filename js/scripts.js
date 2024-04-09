
window.addEventListener('DOMContentLoaded', event => {

    // Toggle the side navigation
    const sidebarToggle = document.body.querySelector('#sidebarToggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', event => {
            event.preventDefault();
            document.body.classList.toggle('sb-sidenav-toggled');
            localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
        });
    }

    const pageTitle = document.getElementById('page-title');
    const pageDesc = document.getElementById('page-desc');

    const table1Title = document.getElementById('table-title1');
    const table1Container = document.getElementById('table-container1');
    const table1Card = document.getElementById('TableCard1');
    const table1Grid = document.getElementById('Table1Grid');

    const table2Title = document.getElementById('table-title2');
    const table2Container = document.getElementById('table-container2');
    const table2Card = document.getElementById('TableCard2');

    const homeBtn = document.getElementById("home");
    const systemBtn = document.getElementById("systemgroups");
    const tcpBtn = document.getElementById("tcp");
    const arpBtn = document.getElementById("arp");
    const snmpBtn = document.getElementById("snmp");

    table1Card.hidden = true;
    table2Card.hidden = true;



    function showAndResetTable1(){
        table1Grid.classList.remove("col-md-6");
        table1Grid.classList.add("col-md-12");

        table1Container.innerHTML = '';
        table2Container.innerHTML = '';
        table1Card.hidden = false;
        table2Card.hidden = true;



    }

    function showAndResetTables(){
        table1Grid.classList.remove("col-md-12");
        table1Grid.classList.add("col-md-6");

        table1Container.innerHTML = '';
        table2Container.innerHTML = '';

        table1Card.hidden = false;
        table2Card.hidden = false;
    }


    async function fetchJsonData(data){
        let url = 'server.php?page=' + data;
        try {
            const res = await fetch(url);
            return await res.json();
        } catch (error) {
            console.error('Error sending request:', error);
            return {msg: "error"};
        }

    }

    homeBtn.addEventListener('click', (event) => {
        pageTitle.textContent = "Modern SNMP Manager"
        pageDesc.textContent = "Welcome to SNMP Manager website, where you can view or modify the value of SNMP groups on your agent devices.";
        table1Container.innerHTML = '';
        table2Container.innerHTML = '';
        table1Card.hidden = true;
        table2Card.hidden = true;
    });
    function initializeEditButtonsListenerHandler(){
        const editButtons = document.querySelectorAll(".edit-btn");
        editButtons.forEach(editButton => {

            editButton.addEventListener("click", async function(event) {
                const cell = event.target.closest("td");
                const span = cell.querySelector("span");
                const currentValue = span.innerText;

                if(editButton.classList.contains("edit-btn")){
                    const input = document.createElement("input");
                    input.type = "text";
                    input.classList.add("edit-input");
                    input.value = currentValue === "Empty" ? "" : currentValue;


                    span.innerHTML = "";
                    span.appendChild(input);


                    editButton.innerHTML = '<i class="fas fa-save"></i> Save';
                    editButton.classList.remove("edit-btn");
                    editButton.classList.add("save-btn");
                }else {
                    const input = span.querySelector("input");
                    span.innerHTML = input.value.trim() === "" ? "Empty" : input.value.trim();
                    const targetProperty = span.id;

                    editButton.innerHTML = '<i class="fas fa-edit"></i> Edit';
                    editButton.classList.remove("save-btn");
                    editButton.classList.add("edit-btn");
                    const postData = {};
                    postData[targetProperty] = input.value.trim();
                    await fetch("server.php", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(postData)
                    });



                }
            });
        });
    }

    systemBtn.addEventListener("click" ,async (event) => {
        showAndResetTable1();
        pageTitle.textContent = "System Groups"
        table1Title.textContent = "System Groups Table"
        pageDesc.textContent = "System Groups are predefined groups of objects that represent fundamental system information."
        const data = await fetchJsonData("systemGroup");

        let headers = "<table id=\"datatable\"><thead><tr>";
        let content = "<tr>";

        Object.keys(data).forEach(function(key, index) {
            headers += `<th>${key}</th>`;
            let value =  data[key];
            // value = value.split(' ')[1];
            if(value.includes("STRING")) {
                const regex = /"(.*)"/ig;
                value = regex.exec(value)[1].trim() ?? value;
            }else if(value.includes("OID")) {
                value = value.split(' ')[1].trim();
            }else if(value.includes("Timeticks")){
                const regex = /Timeticks: \(\d*\) (.*)/g;
                value = regex.exec(value)[1] ?? value;
            } else if(value.empty || value === "\"\"") {
                value = "Empty";
            }

            if(key.includes("Name") || key.includes("Contact") || key.includes("Location")) {
                content += `
                    <td><span id="${key}">${value}</span> <br>
                    <button class="edit-btn">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    </td>`
            }else {
                content += `<td>${value}</td>`
            }
        });

        headers += "</tr></thead><tbody>";
        content += "</tr></tbody></table>";


        table1Container.innerHTML = headers + content;



        new simpleDatatables.DataTable("#datatable");

        initializeEditButtonsListenerHandler();
    });

    tcpBtn.addEventListener("click", async (event) => {
        showAndResetTable1();
        pageTitle.textContent = "TCP Groups"
        table1Title.textContent = "TCP Table"
        pageDesc.textContent = "TCP Table containing all the TCP connections from your applications to remote hosts with the corresponding ports."

        const data = await fetchJsonData("tcpTable");

        let headers = '<table id=\"datatable\"><thead><tr><th>Index</th></th><th>Connection State</th><th>Connection Local Address</th><th>Connection LocalPort</th><th>Connection Remote Address</th><th>Connection Remote Port</th></tr></thead><tbody>';

        let content = '';

        let count = data['tcpConnState'].length;

        for (let index = 0; index < count; index++) {
            content += '<tr>';
            content += `<td>${index+1}</td>`

            let connectionStateCode = parseInt(data['tcpConnState'][index].split(' ')[1]), connectionStateStatus;
            switch (connectionStateCode) {
                case 2:
                    connectionStateStatus = 'listen';
                    break;
                case 3:
                    connectionStateStatus = 'synSent';
                    break;
                case 5:
                    connectionStateStatus = 'established';
                    break;
                case 8:
                    connectionStateStatus = 'closeWait';
                    break;
                case 11:
                    connectionStateStatus = 'timeWait';
                    break;
                default:
                    connectionStateStatus = 'unknown';
            }
            content += `<td>${connectionStateCode} (${connectionStateStatus})</td>`;

            content += `<td>${data['tcpConnLocalAddress'][index].split(' ')[1]}</td>`;
            content += `<td>${data['tcpConnLocalPort'][index].split(' ')[1]}</td>`;
            content += `<td>${data['tcpConnRemAddress'][index].split(' ')[1]}</td>`;
            content += `<td>${data['tcpConnRemPort'][index].split(' ')[1]}</td>`;
            content += '</tr>';


        }

        content += "</tr></tbody></table>";


        table1Container.innerHTML = headers + content;



        new simpleDatatables.DataTable("#datatable");

    });

    arpBtn.addEventListener("click", async (event) => {
        showAndResetTable1();
        pageTitle.textContent = "ARP Group"
        table1Title.textContent = "ARP Table"
        pageDesc.textContent = "ARP Table containing all the ARP translation recorded saved on the agent device."

        const data = await fetchJsonData("arpTable");

        let headers = '<table id=\"datatable\"><thead><tr><th>Index</th></th><th>IPNetToMediaIfIndex</th><th>IPNetToMediaPhysAddress</th><th>IPNetToMediaNetAddress</th><th>IPNetToMediaType</th></tr></thead><tbody>';

        let content = '';

        let count = data['ipNetToMediaIfIndex'].length;

        for (let index = 0; index < count; index++) {
            content += '<tr>';
            content += `<td>${index+1}</td>`



            let ipNetToMediaTypeCode = parseInt(data['ipNetToMediaType'][index].split(' ')[1]);
            let ipNetToMediaTypeStatus;

            switch (ipNetToMediaTypeCode) {
                case 2:
                    ipNetToMediaTypeStatus = 'invalid';
                    break;
                case 3:
                    ipNetToMediaTypeStatus = 'dynamic';
                    break;
                case 4:
                    ipNetToMediaTypeStatus = 'static';
                    break;
                default:
                    ipNetToMediaTypeStatus = 'unknown';
            }

            content += `<td>${data['ipNetToMediaIfIndex'][index].split(' ')[1]}</td>`;
            content += `<td>${data['ipNetToMediaIfIndex'][index].split(' ')[1]}</td>`;
            content += `<td>${data['ipNetToMediaNetAddress'][index].split(' ')[1]}</td>`;
            content += `<td>${ipNetToMediaTypeCode} (${ipNetToMediaTypeStatus})</td>`;
            content += '</tr>';


        }

        content += "</tr></tbody></table>";


        table1Container.innerHTML = headers + content;



        new simpleDatatables.DataTable("#datatable");
    });

    snmpBtn.addEventListener("click", async (event) => {
        showAndResetTables();
        pageTitle.textContent = "SNMP Statistics Group"
        pageDesc.textContent = "SNMP statistics and numbers about snmp groups."
        table1Title.textContent = "SNMP Table By GET Function"
        table2Title.textContent = "SNMP Table By Walk Function"

        const data = await fetchJsonData("snmpStatistics");

        const oidObjectName = [
            "snmpInPkts",
            "snmpOutPkts",
            "snmpInBadVersions",
            "snmpInBadCommunityNames",
            "snmpInBadCommunityUses",
            "snmpInASNParseErrs",
            "SKIP",
            "snmpInTooBigs",
            "snmpInNoSuchNames",
            "snmpInBadValues",
            "snmpInReadOnlys",
            "snmpInGenErrs",
            "snmpInTotalReqVars",
            "snmpInTotalSetVars",
            "snmpInGetRequests",
            "snmpInGetNexts",
            "snmpInSetRequests",
            "snmpInGetResponses",
            "snmpInTraps",
            "snmpOutTooBigs",
            "snmpOutNoSuchNames",
            "snmpOutBadValues",
            "SKIP",
            "snmpOutGenErrs",
            "snmpOutGetRequests",
            "snmpOutGetNexts",
            "snmpOutSetRequests",
            "snmpOutGetResponses",
            "snmpOutTraps",
            "snmpEnableAuthenTraps"
        ];

        const getMethodObject = data['get_method'];
        const walkMethodObject = data['walk_method'];

        let table1Headers = '<table id=\"datatable1\"><thead><tr><th>ID</th></th><th>Name</th><th>Value</th></tr></thead><tbody>';

        let table1Content = '';

        let table2Headers = '<table id=\"datatable2\"><thead><tr><th>Item #</th></th><th>Name</th><th>Value</th></tr></thead><tbody>';

        let table2Content = '';
        let idIndex = 0;
        let printIndex = 0;

        for(let id in getMethodObject) {
            table1Content += '<tr>'
            table1Content += `<td>${id}</td>`;
            table1Content += `<td>${oidObjectName[id-1]}</td>`
            table1Content += `<td>${getMethodObject[id]}</td>`
            table1Content += '</tr>'
        }


        for(let value of walkMethodObject) {
            if(idIndex+1 === 7 || idIndex+1 === 23) {
                idIndex++;
            }
            table2Content += '<tr>'
            table2Content += `<td>${printIndex++}</td>`;
            table2Content += `<td>${oidObjectName[idIndex]}</td>`
            table2Content += `<td>${value.split(' ')[1]}</td>`
            table2Content += '</tr>'
            idIndex++;
        }




        // let count = data['ipNetToMediaIfIndex'].length;

        table1Content += "</tr></tbody></table>";
        table1Container.innerHTML = table1Headers + table1Content;

        table2Content += "</tr></tbody></table>";
        table2Container.innerHTML = table2Headers + table2Content;



        new simpleDatatables.DataTable("#datatable1");
        new simpleDatatables.DataTable("#datatable2");

    });
});
