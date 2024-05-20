import React from 'react';
import { 
    Grid,
    Breadcrumbs,
    Link, 
} from '@mui/material';
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

const BreadcrumbsTable = ({
    signatureChooseHandler,
    actionMenu,
    updatedPdf,
    signedOnClickHandler,
    selectedAction,

})=> {
    return (
        <Grid container alignItems="center" justifyContent="flex-start">
            <Grid item style={{ padding: "10px", marginLeft: "20px" }}>
              <Breadcrumbs
                separator={<NavigateNextIcon fontSize="small" />}
                aria-label="breadcrumb"
              >
                <Link
                  color="inherit"
                  href="/"
                  className="breadcrumbLink"
                  style={{ textDecoration: "none" }}
                >
                  Upload the Files
                </Link>
                <span
                  color="inherit"
                  onClick={() => signatureChooseHandler()}
                  className={`breadcrumbLink ${!actionMenu ? "active" : ""}`}
                  style={{ textDecoration: "none" }}
                >
                  Choose the Signers
                </span>
                {actionMenu && (
                  <span
                    color="inherit"
                    // href="/"
                    className={`breadcrumbLink ${
                      actionMenu && !updatedPdf ? "active" : ""
                    }`}
                    style={{ textDecoration: "none" }}
                    onClick={() => signedOnClickHandler()}
                  >
                    {/**dynamic text render */}
                    {selectedAction === "yourself"
                      ? "Sign a Document"
                      : selectedAction === "signandsend"
                      ? "Sign & Send for Signature"
                      : "Send for Signature"}
                  </span>
                )}
                {updatedPdf && (
                  <span
                    color="inherit"
                    // href="/"
                    className={`breadcrumbLink active`}
                    style={{ textDecoration: "none" }}
                  >
                    Finish
                  </span>
                )}
              </Breadcrumbs>
            </Grid>
          </Grid>
    );
}

export default BreadcrumbsTable;