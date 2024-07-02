import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";

export default function EngagementOptimization() {
  const [headline, setHeadline] = useState("");
  const [subheadings, setSubheadings] = useState([""]);
  const [pullQuotes, setPullQuotes] = useState([""]);
  const [metaDescription, setMetaDescription] = useState("");
  const [tags, setTags] = useState([""]);

  const addSubheading = () => setSubheadings([...subheadings, ""]);
  const addPullQuote = () => setPullQuotes([...pullQuotes, ""]);
  const addTag = () => setTags([...tags, ""]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Optimize for Engagement</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="headline">
            <AccordionTrigger>Craft a Compelling Headline</AccordionTrigger>
            <AccordionContent>
              <Label htmlFor="headline">Headline</Label>
              <Input
                id="headline"
                placeholder="Enter your compelling headline"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="mb-2"
              />
              <p className="text-sm text-muted-foreground">
                Tip: Use power words or create a curiosity gap to make your
                headline more engaging.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="structure">
            <AccordionTrigger>Structure Your Content</AccordionTrigger>
            <AccordionContent>
              <div className="mb-4">
                <Label>Subheadings</Label>
                {subheadings.map((subheading, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <Input
                      placeholder={`Subheading ${index + 1}`}
                      value={subheading}
                      onChange={(e) => {
                        const newSubheadings = [...subheadings];
                        newSubheadings[index] = e.target.value;
                        setSubheadings(newSubheadings);
                      }}
                      className="mr-2"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => {
                        const newSubheadings = subheadings.filter(
                          (_, i) => i !== index
                        );
                        setSubheadings(newSubheadings);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button onClick={addSubheading} className="mt-2">
                  <Plus className="mr-2 h-4 w-4" /> Add Subheading
                </Button>
              </div>

              <div>
                <Label>Pull Quotes</Label>
                {pullQuotes.map((quote, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <Input
                      placeholder={`Pull Quote ${index + 1}`}
                      value={quote}
                      onChange={(e) => {
                        const newQuotes = [...pullQuotes];
                        newQuotes[index] = e.target.value;
                        setPullQuotes(newQuotes);
                      }}
                      className="mr-2"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => {
                        const newQuotes = pullQuotes.filter(
                          (_, i) => i !== index
                        );
                        setPullQuotes(newQuotes);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button onClick={addPullQuote} className="mt-2">
                  <Plus className="mr-2 h-4 w-4" /> Add Pull Quote
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="seo">
            <AccordionTrigger>SEO Optimization</AccordionTrigger>
            <AccordionContent>
              <div className="mb-4">
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  placeholder="Enter meta description for SEO"
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  className="mb-2"
                />
                <p className="text-sm text-muted-foreground">
                  Tip: Keep your meta description between 150-160 characters for
                  optimal display in search results.
                </p>
              </div>

              <div>
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {tag}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newTags = tags.filter((_, i) => i !== index);
                          setTags(newTags);
                        }}
                        className="ml-2 h-4 w-4 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center">
                  <Input
                    placeholder="Add a new tag"
                    // onKeyPress={(e) => {
                    //   if (e.key === 'Enter' && e.target.value.trim() !== '') {
                    //     setTags([...tags, e.target.value.trim()]);
                    //     e.target.value = '';
                    //   }
                    // }}
                    className="mr-2"
                  />
                  <Button onClick={addTag}>Add Tag</Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
