var URL = CONFIG.API_BASE_URL; // "http://localhost:5000/api";

function fetchCategories() {

    let token = localStorage.getItem("AuthToken");

    let table = $("#tableCategory").DataTable({
        ajax: {
            url: URL + '/groupcategory/getcategories', // Replace with actual API URL
            dataSrc: "",
            beforeSend: function (xhr) {
                if (token) {
                    xhr.setRequestHeader("Authorization", `Bearer ${token}`);
                }
            }
        },
        columns: [
            {
                data: "category_name",
                render: function (data, type, row) {
                    return `<span class="editable" data-id="${row._id}" data-field="category_name">${data}</span>`;
                },
            },
            {
                data: "group_id.group_name",
                render: function (data, type, row) {
                    return `<span class="editable" data-id="${row._id}" data-field="group_id">${data}</span>`;
                },
            },
            {
                data: "is_active",
                render: function (data, type, row) {
                    let status = data ? "Active" : "In-Active";
                    let btnClass = data ? "success" : "warning";
                    return `<button class="btn btn-outline-${btnClass} btn-sm w-70">${status}</button>`;
                },
            },
            {
                data: null,
                render: function (data, type, row) {
                    return `<i class="fa-solid fa-pen-to-square edit-icon" data-id="${row._id}"></i>`;
                },
            },
            {
                data: null,
                render: function (data, type, row) {

                    if (row.is_active == true) {
                        return `
                        <a href="javascript:void(0)" onclick="deleteItem('${row._id}', 1)" title="Delete Category">
                            <i class="fa-solid fa-trash"></i>
                        </a>`;
                    }
                    else if (row.is_active == false) {
                        return `
                            <a href="javascript:void(0)" onclick="deleteItem('${row._id}', 2)" title="Un Delete Category">
                                <i class="fa-solid fa-trash-arrow-up"></i>
                            </a>`;
                    }


                },
            },
        ],
        responsive: true,
        paging: true,
        searching: true
    });

    let editingRow = null; // To track the currently edited row

    // Handle Edit/Save Icon Click
    $("#tableCategory tbody").on("click", ".edit-icon", function () {
        let $icon = $(this);
        let row = table.row($icon.closest("tr"));
        let rowData = row.data();

        if ($icon.hasClass("fa-pen-to-square")) {
            // If already editing another row, revert it first
            if (editingRow && editingRow !== row) {
                cancelEdit(editingRow);
            }

            editingRow = row;

            // Replace first 2 cells with input fields
            let $rowEl = $(row.node());
            $rowEl.find("td:eq(0)").html(`<input type="text" class="form-control form-control-sm" value="${rowData.category_name}" data-field="category_name">`);
            // $rowEl.find("td:eq(1)").html(`<input type="text" class="form-control form-control-sm" value="${rowData.group_id.group_name}" data-field="group_name">`);

            let dropdown = `<select class="form-control form-control-sm" data-field="group_name">`;

            groups.forEach(group => {
                const selected = group.group_name === rowData.group_id.group_name ? "selected" : "";
                dropdown += `<option value="${group._id}" ${selected}>${group.group_name}</option>`;
            });

            dropdown += `</select>`;

            $rowEl.find("td:eq(1)").html(dropdown);

            // Change icon to Save
            $icon.removeClass("fa-pen-to-square").addClass("fa-floppy-disk");

        } else if ($icon.hasClass("fa-floppy-disk")) {
            // Save operation
            let $rowEl = $(row.node());
            let newCategory = $rowEl.find("td:eq(0) input").val();
            let newGroupId = $rowEl.find("td:eq(1) select").val();
            let newGroupName = $rowEl.find("td:eq(1) select option:selected").text();

            swal({
                title: "Warning",
                text: "Are you sure do you want to update the data?",
                type: "warning",
                showCancelButton: !0,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, update it !!",
                cancelButtonText: "No, cancel it !!",
                closeOnConfirm: !1,
                closeOnCancel: !1
            }).then((result) => {
                if (result.value) {

                    $.ajax({
                        url: URL + "/groupcategory/updatecategories/" + rowData._id,
                        method: "PUT",
                        contentType: "application/json",
                        headers: {
                            "Authorization": "Bearer " + token
                        },
                        data: JSON.stringify({
                            category_name: newCategory,
                            group_id: newGroupId
                        }),
                        success: function (response) {

                            if (response.category_name != null && response.category_name != undefined) {
                                Swal.fire({
                                    title: 'Success!',
                                    text: 'Category details updated Successfully',
                                    icon: 'success',
                                    type: "success",
                                    confirmButtonText: 'OK'
                                }).then((result) => {
                                    if (result.value) {

                                        rowData.category_name = newCategory;
                                        rowData.group_id.group_name = newGroupName;
                                        table.row($rowEl).data(rowData).draw(false);

                                        editingRow = null;
                                    }
                                });

                            }
                        },
                        error: function (xhr, status, error) {
                            sweetAlert("Oops...", xhr.responseJSON.message, "error");
                        }
                    });

                }
            });


            // if (confirm("Are you sure you want to update the changes?")) {
            //     // Call your API to update the record here
            //     // Example:
            //     /*
            //     $.post(URL + '/groupcategory/update', {
            //         _id: rowData._id,
            //         category_name: newCategory,
            //         group_id: { group_name: newGroupName }
            //     }, function(response) {
            //         // success handler
            //     });
            //     */

            //     // Update DataTable row data manually
            //     rowData.category_name = newCategory;
            //     rowData.group_id.group_name = newGroupName;
            //     table.row($rowEl).data(rowData).draw(false);

            //     editingRow = null;
            // }
        }
    });

    // Optional: Click outside or another row cancel
    function cancelEdit(row) {
        if (!row) return;
        let rowData = row.data();
        let $rowEl = $(row.node());

        $rowEl.find("td:eq(0)").html(`<span class="editable" data-id="${rowData._id}" data-field="category_name">${rowData.category_name}</span>`);
        $rowEl.find("td:eq(1)").html(`<span class="editable" data-id="${rowData._id}" data-field="group_id">${rowData.group_id.group_name}</span>`);

        $rowEl.find(".fa-floppy-disk").removeClass("fa-floppy-disk").addClass("fa-pen-to-square");

        editingRow = null;
    }
}

var groups;

function fetchGroups() {

    let token = localStorage.getItem("AuthToken");

    $.ajax({
        url: URL + "/groupcategory/getgroups",
        method: "GET",
        contentType: "application/json",
        headers: {
            "Authorization": "Bearer " + token
        },
        data: "",
        success: function (response) {

            $("#ddlGroups").empty();

            var data = response;

            groups = data;

            data.forEach(element => {

                if (element.is_active == true) {
                    $("#ddlGroups").append("<option value = '" + element._id + "'>" + element.group_name + "</option>");
                }

            });

            //console.log(response);
        },
        error: function (xhr, status, error) {
            sweetAlert("Oops...", xhr.responseJSON.message, "error");
        }
    });
}

function saveCategory() {

    var categoryName = $("#txtCategoryName").val();

    if (categoryName == "" || categoryName == null) {
        sweetAlert("Oops...", "Enter a valid Category Name", "error");

        return;
    }

    var groupId = $("#ddlGroups").val();

    let token = localStorage.getItem("AuthToken");

    $.ajax({
        url: URL + "/groupcategory/createcategory",
        method: "POST",
        contentType: "application/json",
        headers: {
            "Authorization": "Bearer " + token
        },
        data: JSON.stringify({
            category_name: categoryName,
            group_id: groupId
        }),
        success: function (response) {

            if (response.category_name != null && response.category_name != undefined) {
                document.activeElement.blur();
                $('#addCategoryModal').modal('hide');

                $('#txtCategoryName').val("");

                $('#tableCategory').DataTable().clear().destroy();

                fetchCategories();

            }
        },
        error: function (xhr, status, error) {
            sweetAlert("Oops...", xhr.responseJSON.message, "error");
        }
    });



}

function deleteItem(rowId, type) {

    let token = localStorage.getItem("AuthToken");

    var title = "", isDeleted = false;

    if (type == 1) //delete
    {
        title = "Delete";
        isDeleted = false;
    }
    else if (type == 2) //undelete
    {
        title = "Un-Delete";
        isDeleted = true;
    }

    swal({
        title: "Warning",
        text: "Are you sure do you want to " + title + "?",
        type: "warning",
        showCancelButton: !0,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, " + title + " it !!",
        cancelButtonText: "No, cancel it !!",
        closeOnConfirm: !1,
        closeOnCancel: !1
    }).then((result) => {
        if (result.value) {

            $.ajax({
                url: URL + "/groupcategory/updatecategories/" + rowId,
                method: "PUT",
                contentType: "application/json",
                headers: {
                    "Authorization": "Bearer " + token
                },
                data: JSON.stringify({
                    is_active: isDeleted
                }),
                success: function (response) {

                    if (response.category_name != null && response.category_name != undefined) {
                        $('#tableCategory').DataTable().clear().destroy();

                        fetchCategories();
                    }
                },
                error: function (xhr, status, error) {
                    sweetAlert("Oops...", xhr.responseJSON.message, "error");
                }
            });

        }
    });


}