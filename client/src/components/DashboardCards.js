import React from 'react';
import Grid from "@material-ui/core/Grid/Grid";
import Card from "@material-ui/core/Card/Card";
import CardContent from "@material-ui/core/CardContent/CardContent";
import Typography from "@material-ui/core/Typography/Typography";
import {makeStyles} from "@material-ui/core";
import PropTypes from 'prop-types';

const useStyle = makeStyles({
    card: {
        minWidth: 200,
    },
    cardContainer: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    gridContainer: {
        flexGrow: 1,
    },
    typographyCardTitle: {
        fontSize: 14,
        color: '#D3D3D3',
    },
    floatRight: {
        float: 'right',
    },

});

const DashboardCards = (props) => {
    const classes = useStyle();
    const {overviewItems} = props;
    return (
        <Grid container className={classes.gridContainer} spacing={2}>
            {overviewItems.map(item => (
                <Grid item xs={12} md={6} lg={3}>
                    <Card className={classes.card}>
                        <CardContent className={classes.cardContainer}>
                            <div>
                                <Typography className={classes.typographyCardTitle}>
                                    {item.title}
                                </Typography>
                                <Typography variant="h4">
                                    {item.detail}
                                </Typography>
                            </div>
                            <img src={item.icon} height="60px" width="60px" alt="icon"/>
                        </CardContent>
                    </Card>
                </Grid>
            ))}

        </Grid>
    );
};

DashboardCards.propTypes = {
    overviewItems: PropTypes.array.isRequired,
};

export default DashboardCards;