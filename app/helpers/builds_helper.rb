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

  def power_button(power, character_class)
    tooltip = power.keys.collect do |key| 
      content = case key
                  when "name", "type"
                    power[key].titleize
                  when "cooldown"
                    "<em>#{power[key]}s</em> cooldown".html_safe
                  when "bonus"
                    "<em>#{bonus(character_class)}</em>: #{power[key]}".html_safe
                  else
                    power[key]
                end
      css_class = case key
                    when "type"
                      "#{key} #{power[key]}"
                    else
                      key
                  end
      content_tag(:span, content, :class => css_class)
    end

    content_tag(:a, 
                :class => "button", 
                :href => "#",
                :rel => power["key"],
                :title => tooltip,
                :"data-toggle" => "tooltip",
                :"data-placement" => "right",
                :"data-html" => "true") do
      content_tag(:div, 
                  :class => "image", 
                  :style => "background: url('/assets/powers/#{character_class}/#{power["key"]}.png')") do
      end
    end
  end

private

  def powers(type, character_class)
    conf = class_config(character_class)
    bonus = conf['bonus']
    conf["powers"].select{|k,v| v["type"] == type}
                  .map {|k, v| {"key" => k}.merge(v) }
  end
end
