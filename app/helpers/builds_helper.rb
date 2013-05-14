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

  def power_button(power, character_class)
    tooltip = power.keys.collect do |key| 
      content_tag(:span, (key == "name" ? power[key].titleize : power[key]), :class => key)
    end

    content_tag(:a, 
                :class => "button", 
                :rel => "#{power["name"]}",
                :title => tooltip,
                :"data-toggle" => "tooltip",
                :"data-html" => "true",) do
      content_tag(:div, 
                  :class => "image", 
                  :style => "background: url('/assets/powers/#{character_class}/#{power["name"]}.png')") do
      end
    end
  end

private

  def powers(type, character_class)
    conf = class_config(character_class)
    conf["powers"].select{|k,v| v["type"] == type}.map { |k, v| {"name" => k}.merge(v) }
  end
end
