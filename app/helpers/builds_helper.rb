module BuildsHelper
  def class_config(character_class)
    YAML.load_file("config/classes/#{character_class}.yml")    
  end

  def at_wills(character_class)
    powers("at_will", character_class)
  end

  def dailys(character_class)
    powers("daily", character_class)
  end 

  def encounters(character_class)
    powers("encounter", character_class)
  end 

  def skills(character_class)
    powers("skill", character_class)
  end 

  def bonus(character_class)
    class_config(character_class)["bonus"]
  end

  def tooltip(power, character_class)
    power.keys.collect do |key| 
      content = case key
        when "name", "type"
          power[key].titleize
        when "cooldown"
          "<em>#{power[key]}s</em> cooldown".html_safe
        when "bonus"
          "<em>#{bonus(character_class)}</em>: #{power[key]}".html_safe
        when "rank_2", "rank_3"
          value = power[key].split(":") if power[key]
          "<em>#{value[0]}</em>: #{value[1]}".html_safe
        else
          power[key]
      end

      css_class = case key
        when "name"
          "#{key} #{power[key]}" 
        when "type"
          "#{key} #{power[key]}"
        else
          key
      end
      content_tag(:span, content, :class => css_class)
    end 
  end

  def tree_button(power, character_class)
    placement = (power["level"] == 0 ? "bottom" : "top")

    content_tag(:a, 
                :class => "button #{power["type"]}", 
                :href => "#",
                :rel => power["key"],
                :title => tooltip(power, character_class),
                :"data-toggle" => "tooltip",
                :"data-placement" => placement,
                :"data-animation" => "false",
                :"data-html" => "true") do
      content_tag(:div, 
                  :class => "image", 
                  :style => "background: url('/assets/powers/#{character_class}/#{power["key"]}.png')") do
      end +
      content_tag(:span, power["name"], :class => "name") +
      content_tag(:div, :class => "ranks") do
        content_tag(:span, "", :class => "rank") +
        content_tag(:span, "", :class => "rank") +
        content_tag(:span, "", :class => "rank")
      end +
      content_tag(:input, "", :name => power["key"], :type => "hidden", :value => "0")
    end 
  end 

  def hud_button(power, character_class)
    content_tag(:a, 
                :class => "button", 
                :href => "#",
                :rel => power["key"],
                :title => tooltip(power, character_class),
                :"data-toggle" => "tooltip",
                :"data-placement" => "top",
                :"data-animation" => "false",
                :"data-html" => "true") do
      content_tag(:div, 
                  :class => "image", 
                  :style => "background: url('/assets/powers/#{character_class}/#{power["key"]}.png')") do
      end
    end
  end

  def feat_button(feat, character_class)
    content_tag(:a, 
                :class => "button", 
                :href => "#",
                :rel => feat["key"],
                :"data-toggle" => "tooltip",
                :"data-points" => feat["points"],
                :"data-placement" => "top",
                :"data-animation" => "false",
                :"data-html" => "true") do
      content_tag(:div, 
                  :class => "image",
                  :style => "background: url('/assets/feats/#{feat["type"]}.png')") do
      end +
      content_tag(:span, :class => "points") do
        content_tag(:strong, "0/") +
        content_tag(:em, "#{feat["points"]}")
      end +
      content_tag(:input, "", :name => feat["key"], :type => "hidden", :value => "0")
    end
  end 


  def power_tree(character_class) 
    config = class_config(character_class)
    config["powers"].group_by {|k,v| v["level"]}.each do |level, powers| 
      yield level, powers.map {|k,v| {"key" => k}.merge(v)}
    end
  end

  def feat_tree(character_class) 
    config = class_config(character_class)
    config["feats"].each do |sect, feats| 
      yield sect, feats
    end
  end 

private

  def powers(type, character_class)
    config = class_config(character_class)
    config["powers"].select {|k,v| v["type"] == type}
                    .map {|k,v| {"key" => k}.merge(v)}
  end
end
