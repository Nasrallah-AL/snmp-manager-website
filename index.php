<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <title>SNMP Manager</title>
        <link href="css/simple_datatables.css" rel="stylesheet" />
        <link href="css/styles.css" rel="stylesheet" />
        <link href="css/table-styles.css" rel="stylesheet" />
        <script src="js/fontawesome.js" ></script>
    </head>
    <body class="sb-nav-fixed">
    <?php include './partials/sidebar.php';?>
        <div id="layoutSidenav">
            <?php include './partials/sidebar_nav.php';?>
            <div id="layoutSidenav_content">
                <main>
                    <div class="container-fluid px-4">
                        <h1 class="mt-4" id="page-title">Modern SNMP Manager</h1>
                        <ol class="breadcrumb mb-4">
                            <li class="breadcrumb-item active" id="page-desc"> Welcome to SNMP Manager website, where you can view or modify the value of SNMP groups on your agent devices.</li>
                        </ol>
                        <div class="row">
                            <div class="col-md-12" id="Table1Grid">
                                <div class="card mb-4" id="TableCard1">
                                    <div class="card-header">
                                        <i class="fas fa-table me-1"></i>
                                        <span id="table-title1"> DataTable Example 1 </span>
                                    </div>
                                    <div class="card-body" id="table-container1">

                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="card mb-4" id="TableCard2">
                                    <div class="card-header">
                                        <i class="fas fa-table me-1"></i>
                                        <span id="table-title2"> DataTable Example 2 </span>
                                    </div>
                                    <div class="card-body" id="table-container2">

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </main>
                <?php include './partials/footer.php';?>
            </div>
        </div>
        <script src="js/bootstrap.js" crossorigin="anonymous"></script>
        <script src="js/scripts.js"></script>
        <script src="js/datatables.js" crossorigin="anonymous"></script>
        <script src="js/datatables-simple-demo.js"></script>
    </body>
</html>
