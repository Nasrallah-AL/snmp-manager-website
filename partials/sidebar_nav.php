<?php
    echo '<div id="layoutSidenav_nav">
                <nav class="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
                    <div class="sb-sidenav-menu">
                    <form id="tcpForm" action="/server.php" method="GET">
                        <div class="nav">
                            <div class="sb-sidenav-menu-heading">Core MIB Groups</div>
                            <a class="nav-link" id="home">
                                <div class="sb-nav-link-icon"><i class="fas fa-home"></i></div>
                                Home Page
                            </a>
                            <a class="nav-link" id="systemgroups">
                                <div class="sb-nav-link-icon"><i class="fas fa-desktop"></i></div>
                                System Groups
                            </a>
                            <a class="nav-link" id="tcp">
                                <div class="sb-nav-link-icon"><i class="fas fa-shield-alt"></i></div>
                                TCP Table
                            </a>
                            <a class="nav-link" id="arp">
                                <div class="sb-nav-link-icon"><i class="fas fa-exchange"></i></div>
                                ARP Table
                            </a>
                            <a class="nav-link" id="snmp">
                                <div class="sb-nav-link-icon"><i class="fas fa-pie-chart"></i></div>
                                SNMP Statistics
                            </a>
                        </div>
                        </form>
                    </div>
                </nav>
            </div>';

?>