import React from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";

export default function ListItem({ item, onEdit, onDelete }) {
  return (
    <Card className="m-2">
      <CardContent>
        <Typography variant="h4" component="div" mb={2} style={{ fontWeight: "bold", color: "blue" }}>
          {item.item_name}
        </Typography>
        <Typography variant="body1" component="p" style={{ fontWeight: "bold" }}>
          Category: {item.category}
        </Typography>
        <Typography variant="body1" component="p" style={{ fontWeight: "bold" }}>
          Date: {item.date}
        </Typography>
        <Typography variant="body1" component="p" style={{ fontWeight: "bold" }}>
          Location: {item.location}
        </Typography>
        <Typography variant="body1" component="p" style={{ fontWeight: "bold" }}>
          Description: {item.description}
        </Typography>
      </CardContent>
      <div className="flex justify-between p-2">
        <Button
          variant="contained"
          color="primary"
          onClick={() => onEdit(item)}
          className="mr-2"
        >
          Edit
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => onDelete(item)}
        >
          Delete
        </Button>
      </div>
    </Card>
  );
}
