<?php
use Phppot\DataSource;
use PhpOffice\PhpSpreadsheet\Reader\Xlsx;

include_once 'mysql/mysql_conf.php';
$connection = mysqli_connect(DB_HOST ,DB_USER ,DB_PASS ,DB_NAME);
require_once ('./vendor/autoload.php');

if (isset($_POST["import"])) {

    $allowedFileType = [
        'application/vnd.ms-excel',
        'text/xls',
        'text/xlsx',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    if (in_array($_FILES["file"]["type"], $allowedFileType)) {

        $targetPath = 'uploads/' . $_FILES['file']['name'];
        move_uploaded_file($_FILES['file']['tmp_name'], $targetPath);

        $Reader = new \PhpOffice\PhpSpreadsheet\Reader\Xlsx();

        $spreadSheet = $Reader->load($targetPath);
        $excelSheet = $spreadSheet->getActiveSheet();
        $spreadSheetAry = $excelSheet->toArray();
        $sheetCount = count($spreadSheetAry);

        for ($i = 0; $i <= $sheetCount; $i ++) {
            $first_name = "";
            if (isset($spreadSheetAry[$i][0])) {
                $first_name = mysqli_real_escape_string($connection, $spreadSheetAry[$i][0]);
            }
            $last_name = "";
            if (isset($spreadSheetAry[$i][1])) {
                $last_name = mysqli_real_escape_string($connection, $spreadSheetAry[$i][1]);
            }
            $guest_group = "";
            if (isset($spreadSheetAry[$i][2])) {
                $guest_group = mysqli_real_escape_string($connection, $spreadSheetAry[$i][2]);
            }

            if (! empty($first_name) || ! empty($last_name) || !empty($guest_group)) {
                $query_string = "INSERT INTO guests(first_name,last_name,guest_group) VALUES('{$first_name}', '{$last_name}', '{$guest_group}')";
                if(mysqli_query($connection, $query_string)){
                    $type = "success";
                    $message = "Excel Data Imported into the Database";
                }else{
                    $type = "error";
                    $message = "Problem in Importing Excel Data";
                }
            }
        }
    } else {
        $type = "error";
        $message = "Invalid File Type. Upload Excel File.";
    }
}
?>

<!DOCTYPE html>
<html>
<head>
<style>
body {
	font-family: Arial;
	width: 550px;
}

.outer-container {
	background: #F0F0F0;
	border: #e0dfdf 1px solid;
	padding: 40px 20px;
	border-radius: 2px;
}

.btn-submit {
	background: #333;
	border: #1d1d1d 1px solid;
	border-radius: 2px;
	color: #f0f0f0;
	cursor: pointer;
	padding: 5px 20px;
	font-size: 0.9em;
}

.tutorial-table {
	margin-top: 40px;
	font-size: 0.8em;
	border-collapse: collapse;
	width: 100%;
}

.tutorial-table th {
	background: #f0f0f0;
	border-bottom: 1px solid #dddddd;
	padding: 8px;
	text-align: left;
}

.tutorial-table td {
	background: #FFF;
	border-bottom: 1px solid #dddddd;
	padding: 8px;
	text-align: left;
}

#response {
	padding: 10px;
	margin-top: 10px;
	border-radius: 2px;
	display: none;
}

.success {
	background: #c7efd9;
	border: #bbe2cd 1px solid;
}

.error {
	background: #fbcfcf;
	border: #f3c6c7 1px solid;
}

div#response.display-block {
	display: block;
}
</style>
</head>

<body>
    <h2>Import Excel File into MySQL Database using PHP</h2>

    <div class="outer-container">
        <form action="" method="post" name="frmExcelImport"
            id="frmExcelImport" enctype="multipart/form-data">
            <div>
                <label>Choose Excel File</label> <input type="file"
                    name="file" id="file" accept=".xls,.xlsx">
                <button type="submit" id="submit" name="import"
                    class="btn-submit">Import</button>

            </div>

        </form>

    </div>
    <div id="response"
        class="<?php if(!empty($type)) { echo $type . " display-block"; } ?>"><?php if(!empty($message)) { echo $message; } ?></div>


<?php
$query_string = "SELECT * FROM guests";
$results = mysqli_query($connection, $query_string);
$result = mysqli_fetch_all($results, MYSQLI_ASSOC);
if (! empty($result)) {
    ?>

    <table class='tutorial-table'>
        <thead>
            <tr>
                <th>first name</th>
                <th>last name</th>
                <th>guest group</th>

            </tr>
        </thead>
<?php
    foreach ($result as $row) { // ($row = mysqli_fetch_array($result))
        ?>
        <tbody>
            <tr>
                <td><?php  echo $row['first_name']; ?></td>
                <td><?php  echo $row['last_name']; ?></td>
                <td><?php  echo $row['guest_group']; ?></td>
            </tr>
<?php
    }
    ?>
        </tbody>
    </table>
<?php
}
?>

</body>
</html>